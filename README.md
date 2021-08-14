# ShutterSea

An open-source decentralized platform for freely usable images.

Developed as part of HackFS Hackathon

[https://shuttersea.com](https://shuttersea.com)

Uploaded photos are converted to into multiple sized, and stored in IPFS (using web3.storage)

Metadata of photos are stored in Textile ThreadDB.

Identity using Ceramic IDX

Data in ThreadDB is managed using IDX (using signatures)

Backend is presently in NodeJS (NextJS) and hosted in Vercel. Planning to migrate to ICP Internet Computer decentralized host later. 


## Todo

- ~~User Auth~~
- ~~Image size conversion~~
- ~~Multi size downloads~~
- ~~EXIF Parsing~~
- Fix search results
- ~~Like Functionality~~
- ~~Add Views/Download counter~~
- Add single photo page
- ~~Add author page~~
- ~~Add License, TOS and info pages~~


## ENV

Below environment variables are required for the application to run. Add them to .env.local for local development.

- THREAD_KEY
- THREAD_SECRET
- THREAD_ID
- WEB3_STORAGE_TOKEN