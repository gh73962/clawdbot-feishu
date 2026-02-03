.PHONY: update

update:
	git pull
	pnpm install
	openclaw gateway restart
