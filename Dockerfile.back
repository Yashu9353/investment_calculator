# Use an official lightweight Python image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the dependency file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose port 8080 (OpenShift default)
EXPOSE 8080

# Command to run the app using Gunicorn (Production server)
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
