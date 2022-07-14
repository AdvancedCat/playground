

function reconcilerChildren(preList = [], nextList = []){

    let cur = 0
    // 第一次遍历：找到第一个需要移动的节点位置
    for(; cur < preList.length && cur < nextList.length; cur++){
        let oldNode = preList[cur]
        let newNode = nextList[cur]
        if(oldNode.key !== newNode.key){
            break
        }
        Object.assign(newNode, oldNode, {key: newNode.key})
    }

    // 如果nextList遍历完，preList还有节点的话，标记删除
    if(cur === nextList.length && cur < preList.length){
        preList.forEach(node => node.effectTag = 'Delete')
        return
    }

    // 如果preList遍历完，newList还有节点的话，标记新增
    if(cur < nextList.length && cur === preList.length){
        nextList.forEach(node => node.effectTag = 'Placement')
        return
    }

    // 第二次遍历：处理需要移动的节点
    // 1. 将旧节点处理为 key-value map 数据结构
    const existingChildren = mapRemainingChildren(preList, cur, preList.length)
    // 2. 继续遍历新列表，如在map找到对应的旧节点，则应用；
    let newIndex = cur
    for(; cur < nextList.length; cur++){
        let newNode = nextList[cur]
        if(existingChildren.has(newNode.key)){
            let oldNodeInfo = existingChildren.get(newNode.key)
            let lastIndex = oldNodeInfo.index
            let oldNode = oldNodeInfo.value
            if(lastIndex >= newIndex){
                Object.assign(newNode, oldNode, {key: newNode.key})
                newIndex = lastIndex
            } else{
                Object.assign(newNode, oldNode, {key: newNode.key, effectTag: `Placement`})
            }
            existingChildren.delete(newNode.key)
        }else{
            newNode.effectTag = 'Creation'
        }
    }

    if(existingChildren.size !== 0){
        existingChildren.forEach(value => {
            value.value.effectTag = 'Delete'
        })
    }

    return
}


function mapRemainingChildren(arr, start, end){
    let map = new Map()
    for(let i = start; i < end; i++){
        map.set(arr[i].key, {
            index: i,
            value: arr[i]
        })
    }
    return map
}



let preList = [
    {key: '1', value: 'A'},
    {key: '2', value: 'B'},
    {key: '3', value: 'C'},
    {key: '4', value: 'D'},
    {key: '5', value: 'E'},
]
let nextList = [
    {key: '5'},
    {key: '1'},
    // {key: '2'},
    {key: '3'},
    {key: '4'},
    {key: '6'},
]

reconcilerChildren(preList, nextList)
console.log('preList', preList)
console.log('nextList', nextList)