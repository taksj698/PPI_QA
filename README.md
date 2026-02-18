# Deploy Next.js on Windows Server (Production Guide)

This guide explains how to deploy a Next.js application in **Server
Mode** (without `output: "export"` and with middleware support).

------------------------------------------------------------------------

## System Requirements

-   Windows Server 2016 / 2019 / 2022
-   Administrator access
-   Open required firewall port (example: 4000)

------------------------------------------------------------------------

## 1. Install Node.js (LTS)

Download from: https://nodejs.org

Choose **LTS (Recommended For Most Users)**.

After installation, verify:

``` powershell
node -v
npm -v
```

------------------------------------------------------------------------

## 2. Install Yarn

``` powershell
npm install -g yarn
```

Verify:

``` powershell
yarn -v
```

------------------------------------------------------------------------

## 3. Copy Project to Server

Example path:

    D:\apps\ppi_qa

Project structure should include:

    .next/
    public/
    src/ or app/
    package.json
    yarn.lock
    next.config.ts

------------------------------------------------------------------------

## 4. Install Dependencies

``` powershell
cd D:\apps\ppi_qa
yarn install
```

------------------------------------------------------------------------

## 5. Build Project

``` powershell
yarn build
```

------------------------------------------------------------------------

## 6. Configure Port

Edit package.json:

``` json
"scripts": {
  "start": "next start -p 4000"
}
```

------------------------------------------------------------------------

## 7. Run Application

``` powershell
yarn start
```

Access via:

    http://server-ip:4000

------------------------------------------------------------------------

## 8. Run in Background (Recommended for Production)

### Install PM2

``` powershell
npm install -g pm2
```

### Start Application

``` powershell
pm2 start npm --name "ppi-qa" -- start
```

### Enable Auto-Start After Reboot

``` powershell
pm2 save
pm2 startup
```

Follow the generated command instructions.

### Check Status

``` powershell
pm2 list
```

### View Logs

``` powershell
pm2 logs
```

------------------------------------------------------------------------

## 9. Deploy Updates

When deploying new code:

``` powershell
yarn install
yarn build
pm2 reload ppi-qa
```

------------------------------------------------------------------------

## Optional: Use IIS Reverse Proxy

Install: - URL Rewrite Module - Application Request Routing (ARR)

Enable Proxy in IIS.

Example web.config:

``` xml
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="ReverseProxy" stopProcessing="true">
          <match url="(.*)" />
          <action type="Rewrite" url="http://localhost:4000/{R:1}" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

------------------------------------------------------------------------

## Production Architecture

User → (IIS Optional) → PM2 → Next.js

-   Middleware supported
-   Authentication supported
-   Suitable for internal production systems
