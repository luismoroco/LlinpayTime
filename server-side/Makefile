.PHONY: run 
run:
	python3 index.py

.PHONY: up 
up:
	sudo docker-compose up 

.PHONY: down
down: 
	sudo docker-compose down 

.PHONY: venvp
venvp:
	source venv/bin/activate

.PHONY: ucelery
ucelery:
	celery -A app.celery worker --loglevel=info
