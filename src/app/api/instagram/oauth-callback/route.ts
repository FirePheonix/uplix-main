import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // Handle user cancellation
    if (error === 'access_denied') {
      return NextResponse.redirect(
        new URL('/dashboard/instagram?error=access_denied', request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/dashboard/instagram?error=no_code', request.url)
      );
    }

    // Exchange code for access token using Facebook Graph API
    const clientId = process.env.INSTAGRAM_APP_ID || '3354449318028891';
    const clientSecret = process.env.INSTAGRAM_APP_SECRET || '356bca0008909a069a2c74455332911a';
    const redirectUri = 'http://localhost:3000/api/instagram/oauth-callback';

    console.log('📝 Exchanging code for access token...');
    console.log('Code:', code);

    const tokenResponse = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}&code=${code}`,
      { method: 'GET' }
    );

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('❌ Token exchange error:', error);
      return NextResponse.redirect(
        new URL('/dashboard/instagram?error=token_exchange_failed', request.url)
      );
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ Token received:', tokenData);

    // Exchange short-lived token for long-lived token (Facebook User Access Token)
    const longLivedTokenResponse = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${tokenData.access_token}`
    );

    let finalToken = tokenData.access_token;
    let expiresIn = 3600; // 1 hour default for short-lived tokens

    if (longLivedTokenResponse.ok) {
      const longLivedData = await longLivedTokenResponse.json();
      finalToken = longLivedData.access_token;
      expiresIn = longLivedData.expires_in || 5183999; // ~60 days for long-lived tokens
      console.log('✅ Long-lived token obtained, expires in:', expiresIn, 'seconds');
    }

    // Get Facebook Pages
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?access_token=${finalToken}`
    );

    if (!pagesResponse.ok) {
      console.error('❌ Failed to get Facebook pages');
      return NextResponse.redirect(
        new URL('/dashboard/instagram?error=no_pages', request.url)
      );
    }

    const pagesData = await pagesResponse.json();
    console.log('✅ Pages data:', pagesData);

    if (!pagesData.data || pagesData.data.length === 0) {
      return NextResponse.redirect(
        new URL('/dashboard/instagram?error=no_pages', request.url)
      );
    }

    // Get the first page's Instagram Business Account
    const pageId = pagesData.data[0].id;
    const pageAccessToken = pagesData.data[0].access_token;

    const igAccountResponse = await fetch(
      `https://graph.facebook.com/v21.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`
    );

    if (!igAccountResponse.ok) {
      console.error('❌ Failed to get Instagram Business account');
      return NextResponse.redirect(
        new URL('/dashboard/instagram?error=no_ig_account', request.url)
      );
    }

    const igAccountData = await igAccountResponse.json();
    console.log('✅ Instagram account data:', igAccountData);

    if (!igAccountData.instagram_business_account) {
      return NextResponse.redirect(
        new URL('/dashboard/instagram?error=no_ig_account', request.url)
      );
    }

    const instagramAccountId = igAccountData.instagram_business_account.id;

    // Get Instagram account username
    const igUserResponse = await fetch(
      `https://graph.facebook.com/v21.0/${instagramAccountId}?fields=id,username&access_token=${pageAccessToken}`
    );

    if (!igUserResponse.ok) {
      console.error('❌ Failed to get Instagram user info');
      return NextResponse.redirect(
        new URL('/dashboard/instagram?error=user_info_failed', request.url)
      );
    }

    const userData = await igUserResponse.json();
    console.log('✅ Instagram user data:', userData);

    // Store Instagram data to be accessed by client
    const instagramData = {
      userId: instagramAccountId,
      username: userData.username,
      accessToken: pageAccessToken, // Use page access token for Instagram API calls
      expiresAt: Date.now() + (expiresIn * 1000),
    };

    // Encode data to pass to client via URL (will be stored in localStorage)
    const encodedData = encodeURIComponent(JSON.stringify(instagramData));
    
    const response = NextResponse.redirect(
      new URL(`/dashboard/instagram?success=true&data=${encodedData}`, request.url)
    );

    return response;

  } catch (error: any) {
    console.error('❌ OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/dashboard/instagram?error=unknown', request.url)
    );
  }
}
