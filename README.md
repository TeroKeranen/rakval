# Rakival 

## Update eas build preview
```
eas build -p android --profile preview
```

## Build eas build development
```
eas build --profile development --platform ios
```

## How to Build and Submit an Update to Apple Developer

Follow these steps to build and submit an updated version of your app to the Apple App Store.

### Prerequisites

Before you start, make sure you have:

1. **EAS CLI** installed. If you haven't installed it yet, run:
   ```bash
   npm install -g eas-cli

2. Logged in to your Expo account via EAS CLI:
    ```bash
    eas login

3. Your app configured correctly in eas.json for iOS builds.

### Step-by-Step Guide

1. Build the iOS App

    
    Run the following command to build your iOS app. This command will trigger a build process in the cloud using the configuration specified in your eas.json file.

    ```bash
    eas build --platform ios

    - This command will create a build for the iOS platform based on the settings defined in the eas.json file.
    - Make sure to review and address any errors or prompts during the build process.

2. Monitor the Build
    - After initiating the build, you can monitor the progress in the terminal or visit the Expo EAS dashboard at EAS Build Dashboard.
    - Once the build is complete, you will receive a URL to download the build artifact (e.g., .ipa file for iOS).

3. Submit the Build to the App Store

    ```bash
    eas submit --platform ios

    - This command will guide you through the submission process.
    - Make sure to have your App Store Connect API Key ready. If you haven’t set up an App Store Connect API Key, you will need to create one and add it to your Expo account.

4. Follow the Submission Process
    
    - Follow the prompts in the terminal to authenticate and configure the submission.
    - EAS CLI will automatically upload your build to Apple App Store Connect.
    - Once the submission is complete, review the status on your App Store Connect dashboard.
