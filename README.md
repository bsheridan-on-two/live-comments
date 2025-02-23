# Live Comments

This is a Next.js app for live comments built to showcase Ably LiveSync's MongoDB connector. The system is simple: in order to leave comments, replies and reaction, a request is made to MongoDB. Ably LiveSync utilises MongoDB Change Streams to listen to database changes within MongoDb and sends messages over Ably to a destination channel.

## Getting Started

First we need to set-up the MongoDB server. To do this, either create an account at [MongoDB's website](https://www.mongodb.com/lp/cloud/atlas/try4-reg) or follow the instructions in this [terraform docs page](https://registry.terraform.io/modules/terraform-mongodbatlas-modules/atlas-basic/mongodbatlas/latest/examples/tenant_cluster#org_id-1). You should create a collection called `comments` and `ably`. You should ensure the the Network Access is set up to recieve on all IPs (0.0.0.0/0) and that a role and user has been created that satisfies these [database permissions for LiveSync](https://ably.com/docs/livesync/mongodb#permissions). 

Secondly, we should set up the Ably LiveSync MongoDB rule. You can use this via the [Control API](https://ably.com/docs/api/control-api#tag/rules/paths/~1apps~1%7Bapp_id%7D~1rules/get), or through the Ably dashboard.

To run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Add comments
- Reply to comments (one layer of nested replies)
- React to comments and replies with emojis

## License

This project is licensed under the MIT License.
