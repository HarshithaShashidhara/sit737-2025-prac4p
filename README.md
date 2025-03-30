Calculator Microservice
This is a simple calculator microservice built using Node.js, Express, and Winston for logging. The microservice supports basic arithmetic operations: addition, subtraction, multiplication, and division.

Prerequisites
Node.js installed (v14+ recommended)

NPM installed

Installation
Clone the repository or create a new project directory.

Open a terminal and navigate to the project directory.

Run the following command to install dependencies:

npm install express winston

Running the Microservice
Start the server by running:

node server.js
The server will start on port 3050, and you should see a message:

info: Calculator microservice running at http://localhost:3050

You can perform arithmetic operations by making HTTP GET requests to the endpoints:

Addition:
curl "http://localhost:3050/add?num1=10&num2=5"
Response: {"operation":"add","result":15}

Subtraction:

curl "http://localhost:3050/subtract?num1=10&num2=5"
Response: {"operation":"subtract","result":5}

Multiplication:

curl "http://localhost:3050/multiply?num1=10&num2=5"
Response: {"operation":"multiply","result":50}

Division:

curl "http://localhost:3050/divide?num1=10&num2=5"
Response: {"operation":"divide","result":2}

Viewing Logs
Logs are stored in the logs directory. You can check the logs using:

For combined logs:

type logs\combined.log
For error logs:

type logs\error.log

Troubleshooting
If curl gives an error like The ampersand (&) character is not allowed, wrap the URL in double quotes.

If the server doesn’t start, ensure port 3050 is free, or modify the port in server.js.

Stopping the Server
To stop the server, press CTRL + C in the terminal where it's running.