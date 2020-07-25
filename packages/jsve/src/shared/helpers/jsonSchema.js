import isEmpty from 'lodash/isEmpty'
import {getFlatDataFromTree} from 'react-sortable-tree'

export const generateJsonSchemaCode = ({tree}) => {
  if (isEmpty(tree)) return {}
  let code = ''

  const flatData = getFlatDataFromTree({
    treeData: tree,
    getNodeKey: ({treeIndex}) => treeIndex,
    ignoreCollapsed: false,
  })

  const getRequiredFields = () => {
    const filtered = flatData.filter((e) => e.node.isRequired)
    let arr = []
    if (!isEmpty(filtered)) {
      arr = filtered.map((e) => e.node.title)
    }
    return arr
  }

  const requiredFields = getRequiredFields()
  if (!isEmpty(tree) && tree[0].title) code += `{`

  const prepareJsonFormCode = (jsonForm) => {
    jsonForm.map((el) => {
      if (el.title) {
        let isChild = false
        let isLastChild = false
        const isObject = el.subtitle === 'Object'
        const isArray = el.subtitle === 'Array'

        const flatElement = flatData.find((element) => element.node.title === el.title)

        const parent = !isEmpty(flatElement) ? flatElement.parentNode : null
        const hasParentObject = !isEmpty(parent) && parent.type === 'object'
        const hasTitle = !isEmpty(el.title)

        if (!isEmpty(parent)) {
          isChild = !isEmpty(parent.children)
          isLastChild = isChild ? parent.children[parent.children.length - 1].title === el.title : false
        }

        if (isChild && hasParentObject && hasTitle) {
          code += `"${el.title}": {`
        }
        if (!isEmpty(el.type)) code += `"type": "${el.type}"`
        if (!isEmpty(el.description)) code += `, "description": "${el.description}"`

        if (!isEmpty(requiredFields) && isEmpty(parent)) code += `, "required": ["${requiredFields.join('", "')}"]`
        if (el.uniqueItems) code += `, "uniqueItems": ${el.uniqueItems}`
        if (!isEmpty(el.minItems)) code += `, "minItems": ${el.minItems}`
        if (!isEmpty(el.maxItems)) code += `, "maxItems": ${el.maxItems}`

        if (isObject && hasTitle) {
          code += `, "properties": {`
        }

        if (isArray && hasTitle) {
          code += `, "items":`
          code += !isEmpty(el.children) && el.children.length > 1 ? `[{` : '{'
        }
        if (!isEmpty(el.children)) prepareJsonFormCode(el.children)

        if (!isEmpty(el.excludeMinimum)) code += `, "excludeMinimum": ${el.excludeMinimum}`
        if (!isEmpty(el.excludeMaximum)) code += `, "excludeMaximum": ${el.excludeMaximum}`
        if (!isEmpty(el.pattern)) code += `, "pattern": "${el.pattern}"`
        if (!isEmpty(el.minimum)) code += `, "minimum": ${el.minimum}`
        if (!isEmpty(el.maximum)) code += `, "maximum": ${el.maximum}`
        if (!isEmpty(el.minLength)) code += `, "minLength": ${el.minLength}`
        if (!isEmpty(el.maxLength)) code += `, "maxLength": ${el.maxLength}`

        if (!isEmpty(el.isRequired)) code += `, "isRequired": ${el.isRequired}`
        if (!isEmpty(el.multipleOf)) code += `, "multipleOf": ${el.multipleOf}`
        if (!isEmpty(el.enumVal)) code += `, "enum": ${el.enumVal}`
        if (!isEmpty(el.enumNames)) code += `, "enumNames": ${el.enumNames}`

        if (!isEmpty(el.defaultValue)) code += `, "default": "${el.defaultValue}"`

        if (isChild && hasParentObject && hasTitle) {
          code += `}`
          if (!isLastChild) code += `,`
          if (isLastChild) code += `}`
        }

        if (isArray && hasTitle) {
          code += !isEmpty(el.children) && el.children.length > 1 ? `}]` : '},'
        }
        if (!isEmpty(parent) && parent.type === 'array' && !isLastChild) code += '}, {'

        if (isEmpty(parent)) code += `}`
      }
    })

    return code
  }

  return prepareJsonFormCode(tree)
}
