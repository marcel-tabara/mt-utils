import isEmpty from 'lodash/isEmpty';
import { getFlatDataFromTree, walk } from 'react-sortable-tree';
import { getNodeKey } from '../helper';

export const generateJsonSchemaCode = ({ tree }) => {
  generateJsonSchemaCode1({ tree });
  if (isEmpty(tree)) return {};
  let code = '';

  const flatData = getFlatDataFromTree({
    treeData: tree,
    getNodeKey: ({ treeIndex }) => treeIndex,
    ignoreCollapsed: false,
  });

  const getRequiredFields = () =>
    flatData.filter((e) => e.node.isRequired).map((e) => e.node.title);

  const requiredFields = getRequiredFields();
  if (!isEmpty(tree) && tree[0].title) code += `{`;

  const prepareJsonFormCode = (jsonForm) => {
    jsonForm.map((el) => {
      if (el.title) {
        let isChild = false;
        let isLastChild = false;
        const isObject = el.subtitle === 'Object';
        const isArray = el.subtitle === 'Array';

        const flatElement = flatData.find(
          (element) => element.node.title === el.title,
        );

        const parent = !isEmpty(flatElement) ? flatElement.parentNode : null;
        const hasParentObject = !isEmpty(parent) && parent.type === 'object';
        const hasTitle = !isEmpty(el.title);

        if (!isEmpty(parent)) {
          isChild = !isEmpty(parent.children);
          isLastChild = isChild
            ? parent.children[parent.children.length - 1].title === el.title
            : false;
        }

        if (isChild && hasParentObject && hasTitle) {
          code += `"${el.title}": {`;
        }
        if (!isEmpty(el.type)) code += `"type": "${el.type}"`;
        if (!isEmpty(el.description))
          code += `, "description": "${el.description}"`;

        if (!isEmpty(requiredFields) && isEmpty(parent))
          code += `, "required": ["${requiredFields.join('", "')}"]`;
        if (el.uniqueItems) code += `, "uniqueItems": ${el.uniqueItems}`;
        if (!isEmpty(el.minItems)) code += `, "minItems": ${el.minItems}`;
        if (!isEmpty(el.maxItems)) code += `, "maxItems": ${el.maxItems}`;

        if (isObject && hasTitle) {
          code += `, "properties": {`;
        }

        if (isArray && hasTitle) {
          code += `, "items":`;
          code += !isEmpty(el.children) && el.children.length > 1 ? `[{` : '{';
        }
        if (!isEmpty(el.children)) prepareJsonFormCode(el.children);

        if (!isEmpty(el.excludeMinimum))
          code += `, "excludeMinimum": ${el.excludeMinimum}`;
        if (!isEmpty(el.excludeMaximum))
          code += `, "excludeMaximum": ${el.excludeMaximum}`;
        if (!isEmpty(el.pattern)) code += `, "pattern": "${el.pattern}"`;
        if (!isEmpty(el.minimum)) code += `, "minimum": ${el.minimum}`;
        if (!isEmpty(el.maximum)) code += `, "maximum": ${el.maximum}`;
        if (!isEmpty(el.minLength)) code += `, "minLength": ${el.minLength}`;
        if (!isEmpty(el.maxLength)) code += `, "maxLength": ${el.maxLength}`;

        if (!isEmpty(el.isRequired)) code += `, "isRequired": ${el.isRequired}`;
        if (!isEmpty(el.multipleOf)) code += `, "multipleOf": ${el.multipleOf}`;
        if (!isEmpty(el.enumVal)) code += `, "enum": ${el.enumVal}`;
        if (!isEmpty(el.enumNames)) code += `, "enumNames": ${el.enumNames}`;

        if (!isEmpty(el.defaultValue))
          code += `, "default": "${el.defaultValue}"`;

        if (isChild && hasParentObject && hasTitle) {
          code += `}`;
          if (!isLastChild) code += `,`;
          if (isLastChild) code += `}`;
        }

        if (isArray && hasTitle) {
          code += !isEmpty(el.children) && el.children.length > 1 ? `}]` : '}';
        }
        if (!isEmpty(parent) && parent.type === 'array' && !isLastChild)
          code += '}, {';

        if (isEmpty(parent)) code += `}`;
      }
    });

    return code;
  };

  return prepareJsonFormCode(tree);
};

const baseObject = {
  type: 'object',
  properties: {},
};
const baseArray = {
  type: 'array',
  items: {},
};

export const generateJsonSchemaCode1 = ({ tree }) => {
  let newTree = {};
  walk({
    treeData: tree,
    getNodeKey: getNodeKey,
    callback: ({ node, path, lowerSiblingCounts, treeIndex }) => {
      console.log('########## node', node);
      console.log('########## treeIndex', treeIndex);
      console.log('########## path', path);
      console.log('########## lowerSiblingCounts', lowerSiblingCounts);

      newTree;

      switch (node.type) {
        case 'array':
          //newTree.type = node.type
          break;
        case 'object':
          break;
        default:
          break;
      }

      // If the node has children defined by a function, and is either expanded
      //  or set to load even before expansion, run the function.
      // if (
      //   node.children &&
      //   typeof node.children === 'function' &&
      //   (node.expanded || props.loadCollapsedLazyChildren)
      // ) {
      //   // Call the children fetching function
      //   node.children({
      //     node,
      //     path,
      //     lowerSiblingCounts,
      //     treeIndex,

      //     // Provide a helper to append the new data when it is received
      //     done: (childrenArray) =>
      //       props.onChange(
      //         changeNodeAtPath({
      //           treeData: instanceProps.treeData,
      //           path,
      //           newNode: ({ node: oldNode }) =>
      //             // Only replace the old node if it's the one we set off to find children
      //             //  for in the first place
      //             oldNode === node
      //               ? {
      //                   ...oldNode,
      //                   children: childrenArray,
      //                 }
      //               : oldNode,
      //           getNodeKey: props.getNodeKey,
      //         }),
      //       ),
      //   });
      // }
    },
  });
};
