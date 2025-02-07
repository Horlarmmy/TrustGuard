# app/Dockerfile
FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Install solc
# RUN apt-get update && apt-get install -y software-properties-common \
#     && add-apt-repository ppa:ethereum/ethereum \
#     && apt-get update \
#     && apt-get install -y solc

WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Install Solidity compiler
RUN pip install py-solc-x && \
    python -c "from solcx import install_solc; install_solc('0.8.0')"

# Expose the application port
EXPOSE 7081

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:7081/ || exit 1

CMD ["python", "app.py"]