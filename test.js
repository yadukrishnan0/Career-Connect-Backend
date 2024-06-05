const obj = {
    name:'yadu',
    marks:{
        mal:1,
        eng:2
    }
}

const deepCopy =structuredClone(obj);
const shallowCopy ={...obj};
deepCopy.marks.mal =33;
shallowCopy.marks.mal=44;
console.log(obj)
console.log(shallowCopy);
console.log(deepCopy)