# Use an official Python runtime as a parent image
FROM python:3.11.5-slim-bookworm

# Set the working directory to /app
WORKDIR /app

# # Copy the current directory contents into the container at /app
# COPY todo-api/requirements.txt /app/
# RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY todo-api /app

RUN pip install --no-cache-dir -r requirements.txt
# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variables
ENV MONGO_URI=mongodb://mongo:27017/todo

# Run app.py when the container launches
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
