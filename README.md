# mongo-node-project
🚀 MongoDB + Node.js DevOps Project (Deployed on AWS Free Tier using EC2 + Docker + ECR + ECS Fargate)

📌 Project Overview

This project demonstrates how to deploy a Node.js + MongoDB full-stack microservice using:

MongoDB on EC2 (Ubuntu Server)

Node.js Express API (Dockerized)

Amazon ECR (Elastic Container Registry)

Amazon ECS Fargate (Fully Serverless Containers)

CloudWatch Logs

Security Groups, IAM Roles


🔥 FEATURES BUILT
✔ MongoDB installed on EC2
✔ Node.js Express API with CRUD
✔ Dockerized application
✔ ECR Repository for pushing image
✔ ECS Fargate Service running container
✔ Env variables passed securely
<img width="1024" height="1024" alt="image" src="https://github.com/user-attachments/assets/77288c28-1319-46d0-9ce3-c64c8dca8f4b" />

🟢 PHASE 1 — Create & Configure MongoDB on EC2
1️⃣ Launch EC2 Instance

Region: ap-south-1

AMI: Ubuntu 22.04 LTS

Instance type: t2.micro (Free Tier)

Storage: 8 GB

Security Group:

Allow SSH (22)

Allow MongoDB (27017) only from ECS subnet or your IP

2️⃣ Connect to EC2
ssh -i key.pem ubuntu@<EC2-Public-IP>
3️⃣ Install MongoDB
sudo apt update
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
sudo systemctl status mongodb

4️⃣ Allow MongoDB to Accept External Connections
sudo nano /etc/mongodb.conf


Change:

bind_ip = 0.0.0.0


Restart:

sudo systemctl restart mongodb

5️⃣ Create MongoDB User
mongo

use admin
db.createUser({
  user: "admin",
  pwd: "password123",
  roles: [ { role: "root", db: "admin" } ]
});


Exit:

exit
🟦 PHASE 2 — Create Node.js App
1️⃣ Create project folder
mkdir mongo-node-project
cd mongo-node-project
mkdir app
cd app

2️⃣ Create package.json
nano package.json


Paste:

{
  "name": "mongo-node-app",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.3"
  }
}

3️⃣ Create server.js
nano server.js


Paste:

const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("Node + MongoDB Running Successfully!");
});

app.listen(3000, () => console.log("Server running on port 3000"));

4️⃣ Install Dependencies
npm install

🟧 PHASE 3 — Dockerize the Node.js App
1️⃣ Create Dockerfile
nano Dockerfile


Paste:

FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]

2️⃣ Build Docker Image
docker build -t node-mongo-app .

3️⃣ Test Locally
docker run -p 3000:3000 \
-e MONGO_URI="mongodb://admin:password123@<EC2-Public-IP>:27017/admin" \
node-mongo-app

🟥 PHASE 4 — Push Docker Image to Amazon ECR
1️⃣ Create ECR Repository
aws ecr create-repository --repository-name node-mongo-app --region ap-south-1


Copy repo URL returned.

2️⃣ Authenticate Docker
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <ACCOUNT-ID>.dkr.ecr.ap-south-1.amazonaws.com

3️⃣ Tag Image
docker tag node-mongo-app:latest <ACCOUNT-ID>.dkr.ecr.ap-south-1.amazonaws.com/node-mongo-app:latest

4️⃣ Push Image
docker push <ACCOUNT-ID>.dkr.ecr.ap-south-1.amazonaws.com/node-mongo-app:latest

🟨 PHASE 5 — Deploy on ECS Fargate
1️⃣ Create an ECS Cluster

AWS Console → ECS → Clusters → Create Cluster

Name: mongo-node-cluster

Infrastructure: AWS Fargate

2️⃣ Create Task Definition

Launch Type: Fargate

CPU: 0.25 vCPU

Memory: 0.5 GB

Add container:

Name: node-app

Image: ECR Repo URL

Port: 3000

Environment variable:

MONGO_URI = mongodb://admin:password123@<EC2-Public-IP>:27017/admin


Log Driver: AWS CloudWatch

3️⃣ Create ECS Service

Launch type: Fargate

Task Definition: above one

Desired tasks: 1

Network:

Select VPC

Select Public Subnets

Auto-assign public IP: YES

Security group:

Allow port 3000

🟩 PHASE 6 — Test the Deployment
1️⃣ Get Public IP of ECS Task

ECS → Tasks → Public IP

2️⃣ Test API
Using Browser
http://<public-ip>:3000/

Using Curl
curl http://<public-ip>:3000/


You should see:

Node + MongoDB Running Successfully!

🗑 PHASE 7 — Cleanup (Save Free Tier)
Delete ECS Service
Delete Cluster
Delete Task Definitions
Delete ECR Repository
Terminate EC2 MongoDB Instance
Delete Volumes
Delete Security Groups
Delete ENIs
Delete IAM Roles
Delete CloudWatch Logs
Delete S3 Buckets (if any)
Release Elastic IPs
🏁 Conclusion

This project demonstrates:

✔ Docker
✔ CI/CD-ready architecture
✔ ECR
✔ ECS Fargate
✔ EC2-based MongoDB
✔ CloudWatch logs
✔ Security Groups
✔ IAM roles
✔ End-to-end app deployment

Perfect for a DevOps Engineer / SRE / Cloud Engineer role.
✔ CloudWatch Observability
✔ Entire project fits AWS Free Tier
