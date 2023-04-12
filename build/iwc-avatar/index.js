/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/iwc-avatar/edit/hooks.js":
/*!**************************************!*\
  !*** ./src/iwc-avatar/edit/hooks.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useCommentAvatar": function() { return /* binding */ useCommentAvatar; },
/* harmony export */   "useUserAvatar": function() { return /* binding */ useUserAvatar; }
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);




function getAvatarSizes(sizes) {
  const minSize = sizes ? sizes[0] : 24;
  const maxSize = sizes ? sizes[sizes.length - 1] : 96;
  const maxSizeBuffer = Math.floor(maxSize * 2.5);
  return {
    minSize,
    maxSize: maxSizeBuffer
  };
}
function useDefaultAvatar() {
  const {
    avatarURL: defaultAvatarUrl
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
    const {
      getSettings
    } = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.store);
    const {
      __experimentalDiscussionSettings
    } = getSettings();
    return __experimentalDiscussionSettings;
  });
  return defaultAvatarUrl;
}
function useCommentAvatar(_ref) {
  let {
    commentId
  } = _ref;
  const [avatars] = (0,_wordpress_core_data__WEBPACK_IMPORTED_MODULE_1__.useEntityProp)('root', 'comment', 'author_avatar_urls', commentId);
  const [authorName] = (0,_wordpress_core_data__WEBPACK_IMPORTED_MODULE_1__.useEntityProp)('root', 'comment', 'author_name', commentId);
  const avatarUrls = avatars ? Object.values(avatars) : null;
  const sizes = avatars ? Object.keys(avatars) : null;
  const {
    minSize,
    maxSize
  } = getAvatarSizes(sizes);
  const defaultAvatar = useDefaultAvatar();
  return {
    src: avatarUrls ? avatarUrls[avatarUrls.length - 1] : defaultAvatar,
    minSize,
    maxSize,
    // translators: %s is the Author name.
    alt: authorName ?
    // translators: %s is the Author name.
    (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('%s Avatar'), authorName) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Default Avatar')
  };
}
function useUserAvatar(_ref2) {
  let {
    userId,
    postId,
    postType
  } = _ref2;
  const {
    authorDetails
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
    const {
      getEditedEntityRecord,
      getUser
    } = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_1__.store);
    if (userId) {
      return {
        authorDetails: getUser(userId)
      };
    }
    const _authorId = getEditedEntityRecord('postType', postType, postId)?.author;
    return {
      authorDetails: _authorId ? getUser(_authorId) : null
    };
  }, [postType, postId, userId]);
  const avatarUrls = authorDetails?.avatar_urls ? Object.values(authorDetails.avatar_urls) : null;
  const sizes = authorDetails?.avatar_urls ? Object.keys(authorDetails.avatar_urls) : null;
  const {
    minSize,
    maxSize
  } = getAvatarSizes(sizes);
  const defaultAvatar = useDefaultAvatar();
  return {
    src: avatarUrls ? avatarUrls[avatarUrls.length - 1] : defaultAvatar,
    minSize,
    maxSize,
    alt: authorDetails ?
    // translators: %s is the Author name.
    (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('%s Avatar'), authorDetails?.name) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Default Avatar')
  };
}

/***/ }),

/***/ "./src/iwc-avatar/edit/index.js":
/*!**************************************!*\
  !*** ./src/iwc-avatar/edit/index.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/url */ "@wordpress/url");
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_url__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./hooks */ "./src/iwc-avatar/edit/hooks.js");
/* harmony import */ var _user_control__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./user-control */ "./src/iwc-avatar/edit/user-control.js");








const AvatarInspectorControls = _ref => {
  let {
    setAttributes,
    avatar,
    attributes,
    selectUser
  } = _ref;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Settings')
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
    __nextHasNoMarginBottom: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Image size'),
    onChange: newSize => setAttributes({
      size: newSize
    }),
    min: avatar.minSize,
    max: avatar.maxSize,
    initialPosition: attributes?.size,
    value: attributes?.size
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
    __nextHasNoMarginBottom: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Link to user profile'),
    onChange: () => setAttributes({
      isLink: !attributes.isLink
    }),
    checked: attributes.isLink
  }), attributes.isLink && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Open in new tab'),
    onChange: value => setAttributes({
      linkTarget: value ? '_blank' : '_self'
    }),
    checked: attributes.linkTarget === '_blank'
  }), selectUser && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_user_control__WEBPACK_IMPORTED_MODULE_7__["default"], {
    value: attributes?.userId,
    onChange: value => {
      setAttributes({
        userId: value
      });
    }
  })));
};
const ResizableAvatar = _ref2 => {
  let {
    setAttributes,
    attributes,
    avatar,
    blockProps,
    isSelected
  } = _ref2;
  const borderProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.__experimentalUseBorderProps)(attributes);
  const doubledSizedSrc = (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_5__.addQueryArgs)((0,_wordpress_url__WEBPACK_IMPORTED_MODULE_5__.removeQueryArgs)(avatar?.src, ['s']), {
    s: attributes?.size * 2
  });
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", blockProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ResizableBox, {
    size: {
      width: attributes.size,
      height: attributes.size
    },
    showHandle: isSelected,
    onResizeStop: (event, direction, elt, delta) => {
      setAttributes({
        size: parseInt(attributes.size + (delta.height || delta.width), 10)
      });
    },
    lockAspectRatio: true,
    enable: {
      top: false,
      right: !(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.isRTL)(),
      bottom: true,
      left: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.isRTL)()
    },
    minWidth: avatar.minSize,
    maxWidth: avatar.maxSize
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: doubledSizedSrc,
    alt: avatar.alt,
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('avatar', 'avatar-' + attributes.size, 'photo', 'wp-block-avatar__image', borderProps.className),
    style: borderProps.style
  })));
};
const CommentEdit = _ref3 => {
  let {
    attributes,
    context,
    setAttributes,
    isSelected
  } = _ref3;
  const {
    commentId
  } = context;
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)();
  const avatar = (0,_hooks__WEBPACK_IMPORTED_MODULE_6__.useCommentAvatar)({
    commentId
  });
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(AvatarInspectorControls, {
    avatar: avatar,
    setAttributes: setAttributes,
    attributes: attributes,
    selectUser: false
  }), attributes.isLink ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: "#avatar-pseudo-link",
    className: "wp-block-avatar__link",
    onClick: event => event.preventDefault()
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(ResizableAvatar, {
    attributes: attributes,
    avatar: avatar,
    blockProps: blockProps,
    isSelected: isSelected,
    setAttributes: setAttributes
  })) : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(ResizableAvatar, {
    attributes: attributes,
    avatar: avatar,
    blockProps: blockProps,
    isSelected: isSelected,
    setAttributes: setAttributes
  }));
};
const UserEdit = _ref4 => {
  let {
    attributes,
    context,
    setAttributes,
    isSelected
  } = _ref4;
  const {
    postId,
    postType
  } = context;
  const avatar = (0,_hooks__WEBPACK_IMPORTED_MODULE_6__.useUserAvatar)({
    userId: attributes?.userId,
    postId,
    postType
  });
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)();
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(AvatarInspectorControls, {
    selectUser: true,
    attributes: attributes,
    avatar: avatar,
    setAttributes: setAttributes
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, attributes.isLink ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: "#avatar-pseudo-link",
    className: "wp-block-avatar__link",
    onClick: event => event.preventDefault()
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(ResizableAvatar, {
    attributes: attributes,
    avatar: avatar,
    blockProps: blockProps,
    isSelected: isSelected,
    setAttributes: setAttributes
  })) : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(ResizableAvatar, {
    attributes: attributes,
    avatar: avatar,
    blockProps: blockProps,
    isSelected: isSelected,
    setAttributes: setAttributes
  })));
};
function Edit(props) {
  if (props?.context?.commentId || props?.context?.commentId === null) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(CommentEdit, props);
  }
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(UserEdit, props);
}

/***/ }),

/***/ "./src/iwc-avatar/edit/user-control.js":
/*!*********************************************!*\
  !*** ./src/iwc-avatar/edit/user-control.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_4__);






const AUTHORS_QUERY = {
  who: 'authors',
  per_page: -1,
  _fields: 'id,name',
  context: 'view'
};
function UserControl(_ref) {
  let {
    value,
    onChange
  } = _ref;
  const [filteredAuthorsList, setFilteredAuthorsList] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const authorsList = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
    const {
      getUsers
    } = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_4__.store);
    return getUsers(AUTHORS_QUERY);
  }, []);
  if (!authorsList) {
    return null;
  }
  const options = authorsList.map(author => {
    return {
      label: author.name,
      value: author.id
    };
  });
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ComboboxControl, {
    __nextHasNoMarginBottom: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('User'),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select the avatar user to display, if it is blank it will use the post/page author.'),
    value: value,
    onChange: onChange,
    options: filteredAuthorsList || options,
    onFilterValueChange: inputValue => setFilteredAuthorsList(options.filter(option => option.label.toLowerCase().startsWith(inputValue.toLowerCase())))
  });
}
/* harmony default export */ __webpack_exports__["default"] = (UserControl);

/***/ }),

/***/ "./node_modules/classnames/index.js":
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;
	var nativeCodeString = '[native code]';

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				if (arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				}
			} else if (argType === 'object') {
				if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
					classes.push(arg.toString());
					continue;
				}

				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/core-data":
/*!**********************************!*\
  !*** external ["wp","coreData"] ***!
  \**********************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["coreData"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "@wordpress/url":
/*!*****************************!*\
  !*** external ["wp","url"] ***!
  \*****************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["url"];

/***/ }),

/***/ "./src/iwc-avatar/block.json":
/*!***********************************!*\
  !*** ./src/iwc-avatar/block.json ***!
  \***********************************/
/***/ (function(module) {

"use strict";
module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"name":"iwc-blocks/iwc-avatar","version":"0.1.0","title":"IWC Avatar","category":"theme","icon":"smiley","description":"Add a users avatar.","attributes":{"userId":{"type":"number"},"size":{"type":"number","default":96},"isLink":{"type":"boolean","default":false},"linkTarget":{"type":"string","default":"_self"}},"supports":{"anchor":true,"html":false,"align":true,"alignWide":false,"spacing":{"margin":true,"padding":true},"__experimentalBorder":{"__experimentalSkipSerialization":true,"radius":true,"width":true,"color":true,"style":true,"__experimentalDefaultControls":{"radius":true}},"color":{"text":false,"background":false,"__experimentalDuotone":"img"}},"textdomain":"iwc-blocks","editorScript":"file:./index.js","editorStyle":"file:./editor.css","style":"file:./style.css","usesContext":["postType","postId","commentId"]}');

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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!*********************************!*\
  !*** ./src/iwc-avatar/index.js ***!
  \*********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./block.json */ "./src/iwc-avatar/block.json");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/iwc-avatar/edit/index.js");



//import save from './save';

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_1__.name, {
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"]
  //	save,
});
}();
/******/ })()
;
//# sourceMappingURL=index.js.map