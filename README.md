## Mevify - Ratings and Reviews

An API for a contemporary [e-commerce](https://github.com/Wired-Wardrobe/project-atlier) website that is able to scale as its user base increases.

## Getting Started

Installation
- Clone the repository
    ```
        git clone https://github.com/MEVify/https://github.com/MEVify/ReviewAPI.git
    ```
- Install the dependencies
    ```
        npm install
    ```
- add the correct postgresql login for your system
    ```
        server/db.js
    ```
- Run the following script
    ```
        npm start
    ```

## Author

[Mevludin Causevic](https://github.com/mevcaus)

## Collaborators
[Brett Tanonaka](https://github.com/B-Tanonaka)\
[Neil Xia](https://github.com/NeilLXia)

## Built With
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)![ExpressJS](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)![AWS](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)![loader.io](https://img.shields.io/badge/loader.io-477cbc?&logoColor=white&style=for-the-badge)![k6](https://img.shields.io/badge/k6-7d64ff?logo=k6&logoColor=white&style=for-the-badge)![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)![Git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white)![ESLINT](https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white)

## Key Metrics
- Requests per second: 10,000
- Latency: 13ms average
- Error rate: 0%

<details>
  <summary>Loader.io test results</summary>
<img src="![image](https://user-images.githubusercontent.com/118404053/232253622-c7af1232-46eb-4cf2-acd6-620397fc971a.png)" alt="loader stress test at 3000 request per second" width="75%" height="50%" />
</details>

## Overview
This API handles requests for the Ratings and Reviews section of Wired Wardrobe's [client-side application](https://github.com/Wired-Wardrobe/project-atlier). Approximately five million reviews are available in the database.

#### Server

Each server is able to handle around 1500 requests per second with caching with a sample set of over 100k product id's.

#### Database

PostgreSQL, a relational database was used as each review has a set of associated characteristics, photos, and characteristic styles.

#### Deployment

Each component was hosted on an Amazon Web Services (AWS) EC2 micro-instance. AWS RDS and Elastic Beanstalk were not used.
- Database, 1
- Load balancer, 1
- Servers, 2

## Optimizations

#### Adding servers
- NGINX load balancer distributes requests across the servers
- Benefit: Linear increase, each server was able to handle approximately 1000 requests per second with less than 20ms latency
- Cost: Having to purchase more server space

#### Caching
- NGINX cache stores data for 10 minutes
- Benefit: Exponential increase, improved each server capacity by 300% to handle about 1,500 requests per second with less than 20ms latency
- Cost: Increasing storage space

## Stress Testing

#### Loader.io - Deployed testing after optimizing 

- Deployed testing was primarily on the reviews endpoint because it is the most data demanding and covered over 100,000 possible product id's

<details>
    <summary>3,000 requests per second test results</summary>
    <ul>
      <li>Requests per second: 3,000</li>
      <li>Total requests: 179,953</li>
      <li>Latency: 30ms</li>
      <li>Error rate: 0%</li>
    </ul>
    <img src="![image](https://user-images.githubusercontent.com/118404053/232253857-b84c46d7-3897-486c-940b-17ade0217dbc.png)" alt="Loader.io deployed stress test at 3000 requests per second" width="100%" height="100%"/>
</details>

<details>
    <summary>10000 requests per second test results (only the most popular 10,000 items)</summary>
    <ul>
      <li>Requests per second: 10,000</li>
      <li>Total requests: 449,969</li>
      <li>Latency: 12ms</li>
      <li>Error rate: 0%</li>
    </ul>
    <img src="https://imgur.com/a/7pCte61" alt="Loader.io deployed stress test at 10000 requests per second" width="100%" height="100%"/>
</details>

#### k6 - Local testing before deployment

<details>
    <summary>Product id test results</summary>
      <ul>
        <li>Requests per second: 1000</li>
        <li>Total requests: 30,000</li>
        <li>Latency: 27ms</li>
        <li>Error rate: 0%</li>
    </ul>
    <img src="https://imgur.com/a/OLndw7b" alt="k6 local stress test at reviews endpoint" width="100%" height="100%"/>
</details>


