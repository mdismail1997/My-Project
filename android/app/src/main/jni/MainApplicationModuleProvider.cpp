#include "MainApplicationModuleProvider.h"

<<<<<<< HEAD
#include <rncli.h>
=======
>>>>>>> d65f7a5b7b73a03752fb6e98ae40f142530e8599
#include <rncore.h>

namespace facebook {
namespace react {

std::shared_ptr<TurboModule> MainApplicationModuleProvider(
<<<<<<< HEAD
    const std::string &moduleName,
=======
    const std::string moduleName,
>>>>>>> d65f7a5b7b73a03752fb6e98ae40f142530e8599
    const JavaTurboModule::InitParams &params) {
  // Here you can provide your own module provider for TurboModules coming from
  // either your application or from external libraries. The approach to follow
  // is similar to the following (for a library called `samplelibrary`:
  //
  // auto module = samplelibrary_ModuleProvider(moduleName, params);
  // if (module != nullptr) {
  //    return module;
  // }
  // return rncore_ModuleProvider(moduleName, params);
<<<<<<< HEAD

  // Module providers autolinked by RN CLI
  auto rncli_module = rncli_ModuleProvider(moduleName, params);
  if (rncli_module != nullptr) {
    return rncli_module;
  }

=======
>>>>>>> d65f7a5b7b73a03752fb6e98ae40f142530e8599
  return rncore_ModuleProvider(moduleName, params);
}

} // namespace react
} // namespace facebook
