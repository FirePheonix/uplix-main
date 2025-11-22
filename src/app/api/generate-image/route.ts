import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Helper function to convert image URL to base64
async function urlToBase64(url: string): Promise<string> {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return buffer.toString('base64')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { prompt, instructions, referenceImages, model = 'gpt-image-1', size = '1024x1024', quality = 'auto' } = body

    console.log('=== API ROUTE: GENERATE IMAGE ===')
    console.log('Received body:', JSON.stringify(body, null, 2))
    console.log('Model:', model)
    console.log('Size:', size)
    console.log('Quality:', quality)
    console.log('Prompt:', prompt)
    console.log('Instructions:', instructions)
    console.log('Reference Images:', referenceImages)
    console.log('Reference Images Count:', referenceImages?.length || 0)

    if (!prompt && (!referenceImages || referenceImages.length === 0)) {
      console.error('❌ No prompt or reference images provided')
      return NextResponse.json({ error: 'Either prompt or reference images are required' }, { status: 400 })
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY 
    })

    // Build the full prompt
    let finalPrompt = prompt || 'Generate an image based on the reference provided'
    if (instructions) {
      finalPrompt = `${instructions}\n\n${finalPrompt}`
    }
    
    // If we have reference images, use them based on the model
    if (referenceImages && referenceImages.length > 0) {
      console.log('🖼️ Processing reference images...')
      console.log('Reference images are already base64, count:', referenceImages.length)
      
      if (model === 'gpt-image-1') {
        // GPT Image 1: Use GPT-4 Vision to analyze reference images
        try {
          console.log('🤖 Analyzing reference image with GPT-4 Vision...')
          
          // Use GPT-4 Vision to analyze reference
          const visionResponse = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: 'Describe this image in detail, focusing on: subjects/characters, their appearance, style, composition, color palette, mood, lighting, and artistic elements. Be very specific about what makes this image unique.'
                  },
                  {
                    type: 'image_url',
                    image_url: { url: referenceImages[0] }
                  }
                ]
              }
            ],
            max_tokens: 400
          })

          const imageAnalysis = visionResponse.choices[0]?.message?.content || ''
          console.log('✅ Vision Analysis Result:', imageAnalysis)
          finalPrompt = `${finalPrompt}\n\nIMPORTANT - Style and subject reference: ${imageAnalysis}\n\nYou MUST recreate the exact same subjects/characters from the reference while following the new prompt instructions. Match the style, appearance, and aesthetic exactly.`
          console.log('📝 Enhanced Prompt:', finalPrompt)
        } catch (error) {
          console.error('❌ Error analyzing reference:', error)
          console.error('Error details:', error)
        }
      } else {
        // DALL-E models: Use GPT-4 Vision to analyze and enhance prompt
        try {
          console.log('🤖 Analyzing reference for DALL-E with GPT-4 Vision...')
          
          const visionResponse = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: 'Describe this image in detail, focusing on: subjects/characters, their appearance, style, composition, color palette, mood, lighting, and artistic elements. Be very specific.'
                  },
                  {
                    type: 'image_url',
                    image_url: { url: referenceImages[0] }
                  }
                ]
              }
            ],
            max_tokens: 400
          })

          const imageAnalysis = visionResponse.choices[0]?.message?.content || ''
          console.log('✅ Vision Analysis Result:', imageAnalysis)
          finalPrompt = `${finalPrompt}\n\nReference image details: ${imageAnalysis}\n\nRecreate the same subjects/characters with these exact characteristics while following the new prompt.`
          console.log('📝 Enhanced Prompt for DALL-E:', finalPrompt)
        } catch (error) {
          console.error('❌ Error analyzing reference:', error)
          finalPrompt += `\n\nGenerate in a style similar to the reference image provided, maintaining the same subjects.`
        }
      }
    } else {
      console.log('ℹ️ No reference images provided')
    }

    // Model-specific generation parameters
    const generateParams: any = {
      model,
      prompt: finalPrompt,
      n: 1,
    }

    // Response format - only for DALL-E models
    if (model === 'dall-e-2' || model === 'dall-e-3') {
      generateParams.response_format = 'url'
    }

    // Size validation based on model
    if (model === 'dall-e-2') {
      // DALL-E 2: only supports 256x256, 512x512, 1024x1024
      generateParams.size = '1024x1024'
    } else {
      // GPT Image 1 and DALL-E 3 support more sizes
      generateParams.size = size
    }

    // Quality parameter (only for gpt-image-1 and dall-e-3)
    if (model === 'gpt-image-1' || model === 'dall-e-3') {
      if (quality !== 'auto') {
        generateParams.quality = quality
      }
    }

    console.log('🎨 Generating image with params:', JSON.stringify(generateParams, null, 2))
    const response = await openai.images.generate(generateParams)
    console.log('✅ OpenAI Response received:', response)

    let imageUrl: string | undefined

    // GPT Image 1 returns URL by default (not base64)
    if (model === 'gpt-image-1') {
      // Check both URL and b64_json in response
      imageUrl = response.data[0]?.url || (response.data[0]?.b64_json ? `data:image/png;base64,${response.data[0].b64_json}` : undefined)
      console.log('✅ GPT Image 1: Image URL:', imageUrl)
    } else {
      // DALL-E models return URL
      imageUrl = response.data[0]?.url
      console.log('✅ DALL-E: Image URL:', imageUrl)
    }

    if (!imageUrl) {
      console.error('❌ No image URL generated')
      return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
    }

    console.log('🎉 Successfully generated image')
    return NextResponse.json({ imageUrl })
  } catch (error: any) {
    console.error('❌ Error generating image:', error)
    console.error('Error details:', error.message, error.stack)
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    )
  }
}
