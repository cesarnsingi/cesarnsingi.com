# Production Deployment Issue – cesarnsingi.com

## 1. Problem Overview

**Project:** [cesarnsingi.com](https://cesarnsingi.com)

**Issue:** New page layout not appearing in production.

**Environment:** Vercel – Production

**Status:** Resolved / Under Investigation

**Category:** Deployment / Environment Variables / Redis / API Integration

## 2. Problem Description

A new page layout was implemented locally but was not appearing on the live website.

The changes were visible in the local development environment but were not reflected in production.

Initial investigation suggested that the issue might be related to deployment configuration or missing environment variables.

## 3. Troubleshooting Steps

### Step 1 – Check Vercel Build Logs

- Open the Vercel dashboard.
- Select the `cesarnsingi.com` project.
- Navigate to Deployments.
- Open the latest deployment.
- Review the build logs.
- Check for compilation errors, warnings or failed dependencies.

**Observation:**

The deployment completed successfully, with no build errors or warnings.

### Step 2 – Check Deployment Status

Verify that:

- The latest deployment was successful.
- The deployment is associated with the correct Git branch.
- The production domain points to the latest deployment.
- The latest changes are included in the deployed commit.

### Step 3 – Investigate Environment Variables

Check whether the required environment variables are configured correctly.

Compare:

- Local `.env.local` configuration.
- Vercel Environment Variables.
- Production environment configuration.

**Observation:**

I realised that Redis might not be configured in the production environment.

### Step 4 – Check Vercel Runtime Logs

Build logs only confirm that the application compiled and deployed.

Runtime logs help identify errors that happen when the application is running.

Check for:

- Redis connection failures.
- Missing environment variables.
- API request failures.
- Authentication errors.
- Server-side exceptions.

### Step 5 – Configure Redis

I investigated whether a Redis database was required by the application.

Actions:

1. Open Vercel Marketplace.
2. Find and create a Redis-compatible database integration.
3. Connect the database to the project.
4. Configure the required Redis REST credentials.
5. Verify that the environment variables are available to the production deployment.
6. Redeploy the application if necessary.

### Step 6 – Verify Redis REST Credentials

Check that the required environment variables are configured.

For example:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

The exact variable names must match the application's implementation.

Never commit credentials or tokens to Git.

### Step 7 – Test the Strava API Integration

Test the backfill endpoint to verify that the API is accessible in production.

```bash
curl -X POST \
  https://cesarnsingi.com/api/strava/backfill \
  -H "x-admin-secret: YOUR_ADMIN_SECRET"
```

Replace `YOUR_ADMIN_SECRET` with the actual admin secret configured in Vercel.

Verify:

- The endpoint responds successfully.
- Authentication works.
- The application can communicate with Strava.
- Strava API credentials are valid.
- Redis operations work if required by the endpoint.

## 4. Final Verification

- [ ] Latest Git changes are deployed.
- [ ] Production deployment is successful.
- [ ] Production domain points to the correct deployment.
- [ ] Environment variables are configured.
- [ ] Redis connection is working.
- [ ] Runtime logs contain no relevant errors.
- [ ] Strava API integration is working.
- [ ] New page layout is visible in production.

## 5. Root Cause

**Suspected cause:** Missing or incorrectly configured Redis environment variables in the Vercel production environment.

The local environment had a separate `.env.local` configuration, which did not automatically transfer to Vercel.

## 6. Lessons Learned

- A successful build does not guarantee that the application works correctly in production.
- Local environment variables must be configured separately in Vercel.
- Runtime logs are essential for diagnosing production issues.
- External integrations such as Redis and Strava must be tested independently.
- Always verify that the production domain points to the latest deployment.

## 7. Resolution

**Resolution status:** To be confirmed.

Document the final fix and the verification results once the production layout and API integrations are working correctly.
