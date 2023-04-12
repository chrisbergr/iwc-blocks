/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/iwc-comment-template/edit/hooks.js":
/*!************************************************!*\
  !*** ./src/iwc-comment-template/edit/hooks.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useCommentQueryArgs": function() { return /* binding */ useCommentQueryArgs; },
/* harmony export */   "useCommentTree": function() { return /* binding */ useCommentTree; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/url */ "@wordpress/url");
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_url__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_4__);






// This is limited by WP REST API
const MAX_COMMENTS_PER_PAGE = 100;

/**
 * Return an object with the query args needed to fetch the default page of
 * comments.
 *
 * @param {Object} props        Hook props.
 * @param {number} props.postId ID of the post that contains the comments.
 *                              discussion settings.
 *
 * @return {Object} Query args to retrieve the comments.
 */
const useCommentQueryArgs = _ref => {
  let {
    postId
  } = _ref;
  // Initialize the query args that are not going to change.
  const queryArgs = {
    status: 'approve',
    order: 'asc',
    context: 'embed',
    parent: 0,
    _embed: 'children'
  };

  // Get the Discussion settings that may be needed to query the comments.
  const {
    pageComments,
    commentsPerPage,
    defaultCommentsPage: defaultPage
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(select => {
    const {
      getSettings
    } = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.store);
    const {
      __experimentalDiscussionSettings
    } = getSettings();
    return __experimentalDiscussionSettings;
  });

  // WP REST API doesn't allow fetching more than max items limit set per single page of data.
  // As for the editor performance is more important than completeness of data and fetching only the
  // max allowed for single page should be enough for the purpose of design and laying out the page.
  // Fetching over the limit would return an error here but would work with backend query.
  const perPage = pageComments ? Math.min(commentsPerPage, MAX_COMMENTS_PER_PAGE) : MAX_COMMENTS_PER_PAGE;

  // Get the number of the default page.
  const page = useDefaultPageIndex({
    defaultPage,
    postId,
    perPage,
    queryArgs
  });

  // Merge, memoize and return all query arguments, unless the default page's
  // number is not known yet.
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return page ? {
      ...queryArgs,
      post: postId,
      per_page: perPage,
      page
    } : null;
  }, [postId, perPage, page]);
};

/**
 * Return the index of the default page, depending on whether `defaultPage` is
 * `newest` or `oldest`. In the first case, the only way to know the page's
 * index is by using the `X-WP-TotalPages` header, which forces to make an
 * additional request.
 *
 * @param {Object} props             Hook props.
 * @param {string} props.defaultPage Page shown by default (newest/oldest).
 * @param {number} props.postId      ID of the post that contains the comments.
 * @param {number} props.perPage     The number of comments included per page.
 * @param {Object} props.queryArgs   Other query args.
 *
 * @return {number} Index of the default comments page.
 */
const useDefaultPageIndex = _ref2 => {
  let {
    defaultPage,
    postId,
    perPage,
    queryArgs
  } = _ref2;
  // Store the default page indices.
  const [defaultPages, setDefaultPages] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const key = `${postId}_${perPage}`;
  const page = defaultPages[key] || 0;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    // Do nothing if the page is already known or not the newest page.
    if (page || defaultPage !== 'newest') {
      return;
    }
    // We need to fetch comments to know the index. Use HEAD and limit
    // fields just to ID, to make this call as light as possible.
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_4___default()({
      path: (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_3__.addQueryArgs)('/wp/v2/comments', {
        ...queryArgs,
        post: postId,
        per_page: perPage,
        _fields: 'id'
      }),
      method: 'HEAD',
      parse: false
    }).then(res => {
      const pages = parseInt(res.headers.get('X-WP-TotalPages'));
      setDefaultPages({
        ...defaultPages,
        [key]: pages <= 1 ? 1 : pages // If there are 0 pages, it means that there are no comments, but there is no 0th page.
      });
    });
  }, [defaultPage, postId, perPage, setDefaultPages]);

  // The oldest one is always the first one.
  return defaultPage === 'newest' ? page : 1;
};

/**
 * Generate a tree structure of comment IDs from a list of comment entities. The
 * children of each comment are obtained from `_embedded`.
 *
 * @typedef {{ commentId: number, children: CommentNode }} CommentNode
 *
 * @param {Object[]} topLevelComments List of comment entities.
 * @return {{ commentTree: CommentNode[]}} Tree of comment IDs.
 */
const useCommentTree = topLevelComments => {
  const commentTree = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => topLevelComments?.map(_ref3 => {
    let {
      id,
      _embedded
    } = _ref3;
    const [children] = _embedded?.children || [[]];
    return {
      commentId: id,
      children: children.map(child => ({
        commentId: child.id
      }))
    };
  }), [topLevelComments]);
  return commentTree;
};

/***/ }),

/***/ "./src/iwc-comment-template/edit/index.js":
/*!************************************************!*\
  !*** ./src/iwc-comment-template/edit/index.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ CommentTemplateEdit; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./hooks */ "./src/iwc-comment-template/edit/hooks.js");









const TEMPLATE = [['iwc-blocks/iwc-avatar'], ['core/comment-author-name'], ['core/comment-date'], ['core/comment-content'], ['core/comment-reply-link'], ['core/comment-edit-link']];
const getCommentsPlaceholder = _ref => {
  let {
    perPage,
    pageComments,
    threadComments,
    threadCommentsDepth
  } = _ref;
  const commentsDepth = !threadComments ? 1 : Math.min(threadCommentsDepth, 3);
  const buildChildrenComment = commentsLevel => {
    if (commentsLevel < commentsDepth) {
      const nextLevel = commentsLevel + 1;
      return [{
        commentId: -(commentsLevel + 3),
        children: buildChildrenComment(nextLevel)
      }];
    }
    return [];
  };
  const placeholderComments = [{
    commentId: -1,
    children: buildChildrenComment(1)
  }];
  if ((!pageComments || perPage >= 2) && commentsDepth < 3) {
    placeholderComments.push({
      commentId: -2,
      children: []
    });
  }
  if ((!pageComments || perPage >= 3) && commentsDepth < 2) {
    placeholderComments.push({
      commentId: -3,
      children: []
    });
  }
  return placeholderComments;
};
function CommentTemplateInnerBlocks(_ref2) {
  let {
    comment,
    activeCommentId,
    setActiveCommentId,
    firstCommentId,
    blocks
  } = _ref2;
  const {
    children,
    ...innerBlocksProps
  } = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.useInnerBlocksProps)({}, {
    template: TEMPLATE
  });
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("li", innerBlocksProps, comment.commentId === (activeCommentId || firstCommentId) ? children : null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(MemoizedCommentTemplatePreview, {
    blocks: blocks,
    commentId: comment.commentId,
    setActiveCommentId: setActiveCommentId,
    isHidden: comment.commentId === (activeCommentId || firstCommentId)
  }), comment?.children?.length > 0 ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(CommentsList, {
    comments: comment.children,
    activeCommentId: activeCommentId,
    setActiveCommentId: setActiveCommentId,
    blocks: blocks,
    firstCommentId: firstCommentId
  }) : null);
}
const CommentTemplatePreview = _ref3 => {
  let {
    blocks,
    commentId,
    setActiveCommentId,
    isHidden
  } = _ref3;
  const blockPreviewProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.__experimentalUseBlockPreview)({
    blocks
  });
  const handleOnClick = () => {
    setActiveCommentId(commentId);
  };
  const style = {
    display: isHidden ? 'none' : undefined
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, blockPreviewProps, {
    tabIndex: 0,
    role: "button",
    style: style
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
    ,
    onClick: handleOnClick,
    onKeyPress: handleOnClick
  }));
};
const MemoizedCommentTemplatePreview = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.memo)(CommentTemplatePreview);
const CommentsList = _ref4 => {
  let {
    comments,
    blockProps,
    activeCommentId,
    setActiveCommentId,
    blocks,
    firstCommentId
  } = _ref4;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("ol", blockProps, comments && comments.map((_ref5, index) => {
    let {
      commentId,
      ...comment
    } = _ref5;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.BlockContextProvider, {
      key: comment.commentId || index,
      value: {
        commentId: commentId < 0 ? null : commentId
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(CommentTemplateInnerBlocks, {
      comment: {
        commentId,
        ...comment
      },
      activeCommentId: activeCommentId,
      setActiveCommentId: setActiveCommentId,
      blocks: blocks,
      firstCommentId: firstCommentId
    }));
  }));
};
function CommentTemplateEdit(_ref6) {
  let {
    clientId,
    context: {
      postId
    }
  } = _ref6;
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.useBlockProps)();
  const [activeCommentId, setActiveCommentId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)();
  const {
    commentOrder,
    threadCommentsDepth,
    threadComments,
    commentsPerPage,
    pageComments
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(select => {
    const {
      getSettings
    } = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.store);
    return getSettings().__experimentalDiscussionSettings;
  });
  const commentQuery = (0,_hooks__WEBPACK_IMPORTED_MODULE_7__.useCommentQueryArgs)({
    postId
  });
  const {
    topLevelComments,
    blocks
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(select => {
    const {
      getEntityRecords
    } = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_6__.store);
    const {
      getBlocks
    } = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.store);
    return {
      topLevelComments: commentQuery ? getEntityRecords('root', 'comment', commentQuery) : null,
      blocks: getBlocks(clientId)
    };
  }, [clientId, commentQuery]);
  let commentTree = (0,_hooks__WEBPACK_IMPORTED_MODULE_7__.useCommentTree)(commentOrder === 'desc' && topLevelComments ? [...topLevelComments].reverse() : topLevelComments);
  if (!topLevelComments) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("p", blockProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.Spinner, null));
  }
  if (!postId) {
    commentTree = getCommentsPlaceholder({
      perPage: commentsPerPage,
      pageComments,
      threadComments,
      threadCommentsDepth
    });
  }
  if (!commentTree.length) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("p", blockProps, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('No results found.'));
  }
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(CommentsList, {
    comments: commentTree,
    blockProps: blockProps,
    blocks: blocks,
    activeCommentId: activeCommentId,
    setActiveCommentId: setActiveCommentId,
    firstCommentId: commentTree[0]?.commentId
  });
}

/***/ }),

/***/ "./src/iwc-comment-template/save/index.js":
/*!************************************************!*\
  !*** ./src/iwc-comment-template/save/index.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ save; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);


function save() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, null);
}

/***/ }),

/***/ "@wordpress/api-fetch":
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
/***/ (function(module) {

module.exports = window["wp"]["apiFetch"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ (function(module) {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ (function(module) {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ (function(module) {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/core-data":
/*!**********************************!*\
  !*** external ["wp","coreData"] ***!
  \**********************************/
/***/ (function(module) {

module.exports = window["wp"]["coreData"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ (function(module) {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ (function(module) {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ (function(module) {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "@wordpress/url":
/*!*****************************!*\
  !*** external ["wp","url"] ***!
  \*****************************/
/***/ (function(module) {

module.exports = window["wp"]["url"];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _extends; }
/* harmony export */ });
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

/***/ }),

/***/ "./src/iwc-comment-template/block.json":
/*!*********************************************!*\
  !*** ./src/iwc-comment-template/block.json ***!
  \*********************************************/
/***/ (function(module) {

module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"name":"iwc-blocks/iwc-comment-template","version":"0.1.0","title":"IWC Comment Template","category":"design","parent":["iwc-blocks/iwc-comments"],"icon":"smiley","description":"Contains the block elements used to display a comment, like the title, date, author, avatar and more.","supports":{"align":true,"anchor":true,"html":false,"reusable":false,"spacing":{"margin":true,"padding":true},"typography":{"fontSize":true,"lineHeight":true,"__experimentalFontFamily":true,"__experimentalFontWeight":true,"__experimentalFontStyle":true,"__experimentalTextTransform":true,"__experimentalTextDecoration":true,"__experimentalLetterSpacing":true,"__experimentalDefaultControls":{"fontSize":true}}},"textdomain":"iwc-blocks","editorScript":"file:./index.js","editorStyle":"file:./editor.css","style":"file:./style.css","usesContext":["postId"]}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!*******************************************!*\
  !*** ./src/iwc-comment-template/index.js ***!
  \*******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./block.json */ "./src/iwc-comment-template/block.json");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/iwc-comment-template/edit/index.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./src/iwc-comment-template/save/index.js");




(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_1__.name, {
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"]
});
}();
/******/ })()
;
//# sourceMappingURL=index.js.map