FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY ml_interactive_academy.html lurelock_interactive_academy.html ml_academy_server.py DEPLOYMENT_GUIDE.md /app/

EXPOSE 8765

CMD ["python", "ml_academy_server.py"]
