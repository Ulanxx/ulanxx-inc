# 定义变量
BRANCH_NAME ?= main

push: 
	yarn && yarn docs:build
	git add .
	git commit -m "docs: update at $(shell date '+%Y-%m-%d %H:%M:%S')"
	git push origin $(BRANCH_NAME)
