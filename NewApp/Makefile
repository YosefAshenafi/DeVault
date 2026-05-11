.PHONY: help build-android-debug build-android-release install-android-debug install-android-release build-ios clean-android

# Default target
help:
	@echo "DeVault Build Commands:"
	@echo ""
	@echo "Android Commands:"
	@echo "  make build-android-debug     - Builds the Android Debug APK (for testing)"
	@echo "  make build-android-release   - Builds the Android Release APK (optimized for production)"
	@echo "  make install-android-debug   - Builds and installs the Debug APK to a connected device/emulator via ADB"
	@echo "  make install-android-release - Builds and installs the Release APK to a connected device/emulator via ADB"
	@echo "  make clean-android           - Cleans the Android build cache"
	@echo ""
	@echo "iOS Commands:"
	@echo "  make build-ios               - Compiles and runs the iOS dev build on the Simulator"
	@echo ""

clean-android:
	cd android && ./gradlew clean

build-android-debug:
	cd android && ./gradlew assembleDebug
	@echo "\n✅ Debug APK built at: android/app/build/outputs/apk/debug/app-debug.apk"

build-android-release:
	cd android && ./gradlew assembleRelease
	@echo "\n✅ Release APK built at: android/app/build/outputs/apk/release/app-release.apk"

install-android-debug: build-android-debug
	adb install -r android/app/build/outputs/apk/debug/app-debug.apk

install-android-release: build-android-release
	adb install -r android/app/build/outputs/apk/release/app-release.apk

build-ios:
	npx expo run:ios
