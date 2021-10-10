# Streaming List (LuckyV)

- React
- Twitch Helix API

# Broken
The page is currently broken because of this: https://discuss.dev.twitch.tv/t/search-by-title-not-possible/33868

# Login Requirement
Access to a Twitch account is required as a precaution for the V5 API shut down on February 28, 2022.
After that, every request to the Twitch API needs an Auth token and client-id. (https://discuss.dev.twitch.tv/t/legacy-twitch-api-v5-shutdown-details-and-timeline/32649 and https://blog.twitch.tv/en/2021/07/15/legacy-twitch-api-v5-shutdown-details-and-timeline/)

# Preview
![preview1](https://user-images.githubusercontent.com/34883496/132042537-7a4a0eb1-2be8-4025-8dd1-921f54041c01.png)
![preview2](https://user-images.githubusercontent.com/34883496/132042543-f542743c-e43f-40c0-9e2c-62d7fdc37f68.png)
![preview3](https://user-images.githubusercontent.com/34883496/132042552-e92cd0d7-f7fa-49b9-8aff-2a1b736b0270.png)


# Development

You need to create a file called .env.local with the following content:

```
REACT_APP_TWITCH_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXX
```
