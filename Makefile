.PHONY: all build clean
$(shell mkdir -p build)


SRC_DIR = src

BUILD_DIR = build

CORE_DIR = $(SRC_DIR)/core
VARIABLES = $(CORE_DIR)/var.js
CORE_JS = $(addprefix $(CORE_DIR)/, $(shell ls $(SRC_DIR)/core | grep ".js" | grep -v "\var.js"))

PLUGIN_DIR = src/plugins
PLUGINS = $(addprefix $(PLUGIN_DIR)/, $(shell ls $(PLUGIN_DIR) | grep ".js"))

LIB_DIR = $(SRC_DIR)/lib
LIB_FILES = $(addprefix $(LIB_DIR)/, $(shell ls $(LIB_DIR)))

SASS_DIR = $(SRC_DIR)/sass
SASS_FILE = $(SASS_DIR)/main.scss

WRAP_HEAD = $(SRC_DIR)/wrapper/head.js
WRAP_TAIL = $(SRC_DIR)/wrapper/tail.js

COMPILER = java -jar utils/compiler/compiler.jar
SASS = $(shell which sass)

TARGETJS = $(BUILD_DIR)/rhythm.js
TARGETMINJS = $(BUILD_DIR)/rhythm.min.js
TARGETCSS = $(BUILD_DIR)/rhythm.css
TARGETMINCSS = $(BUILD_DIR)/rhythm.min.css

builtFiles = $(shell ls build)
ifneq (,$(builtFiles))
	clean = rm -r $(BUILD_DIR)/*
endif


all: build

build:
	cat $(WRAP_HEAD) $(VARIABLES) > $(TARGETJS)
	cat $(CORE_JS) $(PLUGINS) >> $(TARGETJS)
	cat $(WRAP_TAIL) >> $(TARGETJS)
	
	cat $(PLUGINS) >> $(TARGETJS)
	
	cp $(LIB_FILES) $(BUILD_DIR)
	
	$(SASS) --style expanded $(SASS_FILE):$(TARGETCSS)

compress:
	$(COMPILER) --js=$(TARGETJS) --js_output_file=$(TARGETMINJS)
	$(SASS) --style compressed $(SASS_FILE):$(TARGETMINCSS)

clean:
	$(clean)

