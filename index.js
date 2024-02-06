module.exports = class UniPackageOptimization {
  /**
   * 
   * @param {string[]} arr 需要打入分包的目录
   * @param {string[]} noArr 不需要打入分包的目录（必须是一级目录下的目录 否则无效 只能是目录）
   */
  constructor(arr, noArr) {
    this.firstLevelDir = Array.isArray(arr) ? arr : []
    this.noDirArr = Array.isArray(noArr) ? noArr : []
  }
  
  apply(compiler) {

    compiler.hooks.emit.tap("UniPackageOptimization", (compilation) => {
      for (let di = 0; di < this.firstLevelDir.length; di++) {
        const dItem = this.firstLevelDir[di];
        const jsonFile = /^[\w][\w-\/]*.json/
        const comSub = new RegExp(`^${dItem}\/([\\w-]*)\/[\\w\/-]*.json`)
        const useComSub = new RegExp(`^\/${dItem}\/([\\w-]*)\/[\\w\/-]*`)
        // 处理 app.json 文件
        let appJson = JSON.parse(compilation.assets['app.json'].source())
        
        for (const name of Object.keys(compilation.assets)) {
          if(comSub.test(name)) {
            
            let find = this.noDirArr.find(item => name.includes(item))
            if(find){
              continue
            } 
            console.log(name)
            let subComName = name.match(comSub)[1]
            let rootPath = `${dItem}/${subComName}`
            if(!appJson.subPackages.find(item => item.root == rootPath)) {
              appJson.subPackages.push({
                "root": rootPath,
                "pages": [name.split(subComName + "/")[1].split('.')[0]]
              })
            }
          }
        }
        compilation.assets['app.json'] = {
          source () {
            return JSON.stringify(appJson)
          },
          size () {
            return this.source().length
          }
        }
  
        // 处理组件代替
        for (const name of Object.keys(compilation.assets)) {
          if(jsonFile.test(name)) {
            
            let flieJson = JSON.parse(compilation.assets[name].source())
            let subComName = name.match(comSub) ? name.match(comSub)[1] : ""
            if(flieJson.usingComponents) {
              for(const comName of Object.keys(flieJson.usingComponents)){
                const comPath = flieJson.usingComponents[comName]
                if(useComSub.test(comPath)) {
                  let comPathRoot = comPath.match(useComSub)[1]
                  if(subComName != comPathRoot) {
                    if(!flieJson.componentPlaceholder) {
                      flieJson.componentPlaceholder = {}
                    }
                    flieJson.componentPlaceholder[comName] = "view"
                  }
                }
              }
            }
            compilation.assets[name] = {
              source () {
                return JSON.stringify(flieJson)
              },
              size () {
                return this.source().length
              }
            }
          }
        }
      }

    })
  }
}