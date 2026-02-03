.PHONY: deploy clean

deploy: clean
	mkdir -p bin
	npm pack --pack-destination ./bin
	scp bin/*.tgz moltbot@dev.superant.cc:~/plugin/feishu/
	rm -rf bin

clean:
	rm -rf bin
