# Debug Session: CORS Preflight Network Error

## 1. Symptoms
- **Actual Behavior**: The frontend console displays: `[Zustand Store] Error fetching notebooks: Network Error` on `HomePage.tsx:17`.
- **Expected Behavior**: The frontend should successfully fetch the notebooks list from the backend API running at `http://localhost:3000`.
- **Reproduction**: Load the homepage in development mode.

## 2. Investigation & Evidence
1. **Frontend Request Configuration**:
   - The Axios instance defined in `frontend/src/lib/api.ts` attaches a custom client header:
     ```typescript
     headers: {
       "Content-Type": "application/json",
       useruuid: getOrCreateUUID(),
     }
     ```
2. **CORS Configuration on Backend**:
   - In `backend/src/config/cors.ts`, the `allowedHeaders` configuration was:
     ```typescript
     allowedHeaders: [
       "Content-Type",
       "Authorization",
       "X-Requested-With",
       "Accept",
     ]
     ```
   - Because the custom header `useruuid` was **not** listed in the backend's allowed CORS headers, the browser's preflight `OPTIONS` request was rejected, resulting in a **Network Error** (CORS preflight blocked).

## 3. Resolution
- **Action**: Updated `backend/src/config/cors.ts` to explicitly allow `useruuid` and `userUUID` in `allowedHeaders`:
  ```diff
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
+     "useruuid",
+     "userUUID",
    ],
  ```
- **Verification**:
  - Restarted the backend container via `docker compose restart backend`.
  - Ran a manual HTTP `OPTIONS` preflight test:
    ```bash
    curl.exe -X OPTIONS http://localhost:3000/api/notebook/getAll -H "Origin: http://localhost:5173" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: useruuid" -i
    ```
  - The server responded with a successful `200 OK` and returned:
    ```http
    Access-Control-Allow-Headers: Content-Type,Authorization,X-Requested-With,Accept,useruuid,userUUID
    ```

The preflight request is now allowed, which resolves the browser preflight block and the Zustand Network Error!
