#include "MainApplicationTurboModuleManagerDelegate.h"
#include "MainApplicationModuleProvider.h"

namespace facebook {
namespace react {

jni::local_ref<MainApplicationTurboModuleManagerDelegate::jhybriddata>
MainApplicationTurboModuleManagerDelegate::initHybrid(
    jni::alias_ref<jhybridobject>) {
  return makeCxxInstance();
}

void MainApplicationTurboModuleManagerDelegate::registerNatives() {
  registerHybrid({
      makeNativeMethod(
          "initHybrid", MainApplicationTurboModuleManagerDelegate::initHybrid),
      makeNativeMethod(
          "canCreateTurboModule",
          MainApplicationTurboModuleManagerDelegate::canCreateTurboModule),
  });
}

std::shared_ptr<TurboModule>
MainApplicationTurboModuleManagerDelegate::getTurboModule(
<<<<<<< HEAD
    const std::string &name,
    const std::shared_ptr<CallInvoker> &jsInvoker) {
=======
    const std::string name,
    const std::shared_ptr<CallInvoker> jsInvoker) {
>>>>>>> d65f7a5b7b73a03752fb6e98ae40f142530e8599
  // Not implemented yet: provide pure-C++ NativeModules here.
  return nullptr;
}

std::shared_ptr<TurboModule>
MainApplicationTurboModuleManagerDelegate::getTurboModule(
<<<<<<< HEAD
    const std::string &name,
=======
    const std::string name,
>>>>>>> d65f7a5b7b73a03752fb6e98ae40f142530e8599
    const JavaTurboModule::InitParams &params) {
  return MainApplicationModuleProvider(name, params);
}

bool MainApplicationTurboModuleManagerDelegate::canCreateTurboModule(
<<<<<<< HEAD
    const std::string &name) {
=======
    std::string name) {
>>>>>>> d65f7a5b7b73a03752fb6e98ae40f142530e8599
  return getTurboModule(name, nullptr) != nullptr ||
      getTurboModule(name, {.moduleName = name}) != nullptr;
}

} // namespace react
} // namespace facebook
