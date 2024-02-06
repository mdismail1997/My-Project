#pragma once

#include <memory>
#include <string>

#include <ReactCommon/JavaTurboModule.h>

namespace facebook {
namespace react {

std::shared_ptr<TurboModule> MainApplicationModuleProvider(
<<<<<<< HEAD
    const std::string &moduleName,
=======
    const std::string moduleName,
>>>>>>> d65f7a5b7b73a03752fb6e98ae40f142530e8599
    const JavaTurboModule::InitParams &params);

} // namespace react
} // namespace facebook
