import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

import React from 'react';
import ReactDOM from 'react-dom';
import KeyCode from 'rc-util/es/KeyCode';
import classnames from 'classnames';
import Animate from 'rc-animate';
import classes from 'component-classes';
import { getPropValue, getValuePropValue, isCombobox, isMultipleOrTags, isMultipleOrTagsOrCombobox, isSingleMode, toArray, findIndexInValueByKey, UNSELECTABLE_ATTRIBUTE, UNSELECTABLE_STYLE, preventDefaultEvent, findFirstMenuItem, includesSeparators, splitBySeparators, findIndexInValueByLabel, defaultFilterFn } from './util';
import SelectTrigger from './SelectTrigger';
import { SelectPropTypes } from './PropTypes';
import { Item as MenuItem, ItemGroup as MenuItemGroup } from 'rc-menu';
import warning from 'warning';

function noop() {}

function saveRef(name, component) {
  this[name] = component;
}

function chaining() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

        for (var i = 0; i < fns.length; i++) {
      if (fns[i] && typeof fns[i] === 'function') {
        fns[i].apply(this, args);
      }
    }
  };
}

var Select = function (_React$Component) {
  _inherits(Select, _React$Component);

  function Select(props) {
    _classCallCheck(this, Select);

    var _this = _possibleConstructorReturn(this, (Select.__proto__ || Object.getPrototypeOf(Select)).call(this, props));

    _initialiseProps.call(_this);

    var value = [];
    if ('value' in props) {
      value = toArray(props.value);
    } else {
      value = toArray(props.defaultValue);
    }
    value = _this.addLabelToValue(props, value);
    value = _this.addTitleToValue(props, value);
    var inputValue = '';
    if (props.combobox) {
      inputValue = value.length ? _this.getLabelFromProps(props, value[0].key) : '';
    }
    _this.saveInputRef = saveRef.bind(_this, 'inputInstance');
    _this.saveInputMirrorRef = saveRef.bind(_this, 'inputMirrorInstance');
    var open = props.open;
    if (open === undefined) {
      open = props.defaultOpen;
    }
    _this.state = {
      value: value,
      inputValue: inputValue,
      open: open
    };
    _this.adjustOpenState();
    return _this;
  }

  _createClass(Select, [{
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      this.props = nextProps;
      this.state = nextState;
      this.adjustOpenState();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (isMultipleOrTags(this.props)) {
        var inputNode = this.getInputDOMNode();
        var mirrorNode = this.getInputMirrorDOMNode();
        if (inputNode.value) {
          inputNode.style.width = '';
          inputNode.style.width = mirrorNode.clientWidth + 'px';
        } else {
          inputNode.style.width = '';
        }
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.clearFocusTime();
      this.clearBlurTime();
      this.clearAdjustTimer();
      if (this.dropdownContainer) {
        ReactDOM.unmountComponentAtNode(this.dropdownContainer);
        document.body.removeChild(this.dropdownContainer);
        this.dropdownContainer = null;
      }
    }

    
  }, {
    key: 'render',
    value: function render() {
      var _rootCls;

      var props = this.props;
      var multiple = isMultipleOrTags(props);
      var state = this.state;
      var className = props.className,
          disabled = props.disabled,
          allowClear = props.allowClear,
          prefixCls = props.prefixCls;

      var ctrlNode = this.renderTopControlNode();
      var extraSelectionProps = {};
      var open = this.state.open;

      var options = this._options;
      if (!isMultipleOrTagsOrCombobox(props)) {
        extraSelectionProps = {
          onKeyDown: this.onKeyDown,
          tabIndex: 0
        };
      }
      var rootCls = (_rootCls = {}, _defineProperty(_rootCls, className, !!className), _defineProperty(_rootCls, prefixCls, 1), _defineProperty(_rootCls, prefixCls + '-open', open), _defineProperty(_rootCls, prefixCls + '-focused', open || !!this._focused), _defineProperty(_rootCls, prefixCls + '-combobox', isCombobox(props)), _defineProperty(_rootCls, prefixCls + '-disabled', disabled), _defineProperty(_rootCls, prefixCls + '-enabled', !disabled), _defineProperty(_rootCls, prefixCls + '-allow-clear', !!props.allowClear), _rootCls);
      var clearStyle = _extends({}, UNSELECTABLE_STYLE, {
        display: 'none'
      });
      if (state.inputValue || state.value.length) {
        clearStyle.display = 'block';
      }
      var clear = React.createElement('span', _extends({
        key: 'clear',
        onMouseDown: preventDefaultEvent,
        style: clearStyle
      }, UNSELECTABLE_ATTRIBUTE, {
        className: prefixCls + '-selection__clear',
        onClick: this.onClearSelection
      }));
      return React.createElement(
        SelectTrigger,
        {
          onPopupFocus: this.onPopupFocus,
          dropdownAlign: props.dropdownAlign,
          dropdownClassName: props.dropdownClassName,
          dropdownMatchSelectWidth: props.dropdownMatchSelectWidth,
          defaultActiveFirstOption: props.defaultActiveFirstOption,
          dropdownMenuStyle: props.dropdownMenuStyle,
          transitionName: props.transitionName,
          animation: props.animation,
          prefixCls: props.prefixCls,
          dropdownStyle: props.dropdownStyle,
          combobox: props.combobox,
          showSearch: props.showSearch,
          options: options,
          multiple: multiple,
          disabled: disabled,
          visible: open,
          inputValue: state.inputValue,
          value: state.value,
          firstActiveValue: props.firstActiveValue,
          onDropdownVisibleChange: this.onDropdownVisibleChange,
          getPopupContainer: props.getPopupContainer,
          onMenuSelect: this.onMenuSelect,
          onMenuDeselect: this.onMenuDeselect,
          ref: 'trigger'
        },
        React.createElement(
          'div',
          {
            style: props.style,
            ref: 'root',
            onBlur: this.onOuterBlur,
            onFocus: this.onOuterFocus,
            className: classnames(rootCls)
          },
          React.createElement(
            'div',
            _extends({
              ref: 'selection',
              key: 'selection',
              className: prefixCls + '-selection\n            ' + prefixCls + '-selection--' + (multiple ? 'multiple' : 'single'),
              role: 'combobox',
              'aria-autocomplete': 'list',
              'aria-haspopup': 'true',
              'aria-expanded': open
            }, extraSelectionProps),
            ctrlNode,
            allowClear ? clear : null,
            multiple || !props.showArrow ? null : React.createElement(
              'span',
              _extends({
                key: 'arrow',
                className: prefixCls + '-arrow',
                style: UNSELECTABLE_STYLE
              }, UNSELECTABLE_ATTRIBUTE, {
                onClick: this.onArrowClick
              }),
              React.createElement('b', null)
            )
          )
        )
      );
    }
  }]);

  return Select;
}(React.Component);

Select.propTypes = SelectPropTypes;
Select.defaultProps = {
  prefixCls: 'rc-select',
  defaultOpen: false,
  labelInValue: false,
  defaultActiveFirstOption: true,
  showSearch: true,
  allowClear: false,
  placeholder: '',
  onChange: noop,
  onFocus: noop,
  onBlur: noop,
  onSelect: noop,
  onSearch: noop,
  onDeselect: noop,
  showArrow: true,
  dropdownMatchSelectWidth: true,
  dropdownStyle: {},
  dropdownMenuStyle: {},
  optionFilterProp: 'value',
  optionLabelProp: 'value',
  notFoundContent: 'Not Found',
  backfill: false
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.componentWillReceiveProps = function (nextProps) {
    if ('value' in nextProps) {
      var value = toArray(nextProps.value);
      value = _this2.addLabelToValue(nextProps, value);
      value = _this2.addTitleToValue(nextProps, value);
      _this2.setState({
        value: value
      });
      if (nextProps.combobox) {
        _this2.setState({
          inputValue: value.length ? _this2.getLabelFromProps(nextProps, value[0].key) : ''
        });
      }
    }
  };

  this.onInputChange = function (event) {
    var tokenSeparators = _this2.props.tokenSeparators;

    var val = event.target.value;
    if (isMultipleOrTags(_this2.props) && tokenSeparators && includesSeparators(val, tokenSeparators)) {
      var nextValue = _this2.tokenize(val);
      _this2.fireChange(nextValue);
      _this2.setOpenState(false, true);
      _this2.setInputValue('', false);
      return;
    }
    _this2.setInputValue(val);
    _this2.setState({
      open: true
    });
    if (isCombobox(_this2.props)) {
      _this2.fireChange([{
        key: val
      }]);
    }
  };

  this.onDropdownVisibleChange = function (open) {
    if (open && !_this2._focused) {
      _this2.clearBlurTime();
      _this2.timeoutFocus();
      _this2._focused = true;
      _this2.updateFocusClassName();
    }
    _this2.setOpenState(open);
  };

  this.onKeyDown = function (event) {
    var props = _this2.props;
    if (props.disabled) {
      return;
    }
    var keyCode = event.keyCode;
    if (_this2.state.open && !_this2.getInputDOMNode()) {
      _this2.onInputKeyDown(event);
    } else if (keyCode === KeyCode.ENTER || keyCode === KeyCode.DOWN) {
      _this2.setOpenState(true);
      event.preventDefault();
    }
  };

  this.onInputKeyDown = function (event) {
    var props = _this2.props;
    if (props.disabled) {
      return;
    }
    var state = _this2.state;
    var keyCode = event.keyCode;
    if (isMultipleOrTags(props) && !event.target.value && keyCode === KeyCode.BACKSPACE) {
      event.preventDefault();
      var value = state.value;

      if (value.length) {
        _this2.removeSelected(value[value.length - 1].key);
      }
      return;
    }
    if (keyCode === KeyCode.DOWN) {
      if (!state.open) {
        _this2.openIfHasChildren();
        event.preventDefault();
        event.stopPropagation();
        return;
      }
    } else if (keyCode === KeyCode.ESC) {
      if (state.open) {
        _this2.setOpenState(false);
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }

    if (state.open) {
      var menu = _this2.refs.trigger.getInnerMenu();
      if (menu && menu.onKeyDown(event, _this2.handleBackfill)) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  };

  this.onMenuSelect = function (_ref) {
    var item = _ref.item;

    var value = _this2.state.value;
    var props = _this2.props;
    var selectedValue = getValuePropValue(item);
    var selectedLabel = _this2.getLabelFromOption(item);
    var lastValue = value[value.length - 1];
    var event = selectedValue;
    if (props.labelInValue) {
      event = {
        key: event,
        label: selectedLabel
      };
    }
    props.onSelect(event, item);
    var selectedTitle = item.props.title;
    if (isMultipleOrTags(props)) {
      if (findIndexInValueByKey(value, selectedValue) !== -1) {
        return;
      }
      value = value.concat([{
        key: selectedValue,
        label: selectedLabel,
        title: selectedTitle
      }]);
    } else {
      if (isCombobox(props)) {
        _this2.skipAdjustOpen = true;
        _this2.clearAdjustTimer();
        _this2.skipAdjustOpenTimer = setTimeout(function () {
          _this2.skipAdjustOpen = false;
        }, 0);
      }
      if (lastValue && lastValue.key === selectedValue && !lastValue.backfill) {
        _this2.setOpenState(false, true);
        return;
      }
      value = [{
        key: selectedValue,
        label: selectedLabel,
        title: selectedTitle
      }];
      _this2.setOpenState(false, true);
    }
    _this2.fireChange(value);
    var inputValue = void 0;
    if (isCombobox(props)) {
      inputValue = getPropValue(item, props.optionLabelProp);
    } else {
      inputValue = '';
    }
    _this2.setInputValue(inputValue, false);
  };

  this.onMenuDeselect = function (_ref2) {
    var item = _ref2.item,
        domEvent = _ref2.domEvent;

    if (domEvent.type === 'click') {
      _this2.removeSelected(getValuePropValue(item));
    }
    _this2.setInputValue('', false);
  };

  this.onArrowClick = function (e) {
    e.stopPropagation();
    if (!_this2.props.disabled) {
      _this2.setOpenState(!_this2.state.open, !_this2.state.open);
    }
  };

  this.onPlaceholderClick = function () {
    if (_this2.getInputDOMNode()) {
      _this2.getInputDOMNode().focus();
    }
  };

  this.onOuterFocus = function (e) {
    if (_this2.props.disabled) {
      e.preventDefault();
      return;
    }
    _this2.clearBlurTime();
    if (!isMultipleOrTagsOrCombobox(_this2.props) && e.target === _this2.getInputDOMNode()) {
      return;
    }
    if (_this2._focused) {
      return;
    }
    _this2._focused = true;
    _this2.updateFocusClassName();
    _this2.timeoutFocus();
  };

  this.onPopupFocus = function () {
        _this2.maybeFocus(true, true);
  };

  this.onOuterBlur = function (e) {
    if (_this2.props.disabled) {
      e.preventDefault();
      return;
    }
    _this2.blurTimer = setTimeout(function () {
      _this2._focused = false;
      _this2.updateFocusClassName();
      var props = _this2.props;
      var value = _this2.state.value;
      var inputValue = _this2.state.inputValue;

      if (isSingleMode(props) && props.showSearch && inputValue && props.defaultActiveFirstOption) {
        var options = _this2._options || [];
        if (options.length) {
          var firstOption = findFirstMenuItem(options);
          if (firstOption) {
            value = [{
              key: firstOption.key,
              label: _this2.getLabelFromOption(firstOption)
            }];
            _this2.fireChange(value);
          }
        }
      } else if (isMultipleOrTags(props) && inputValue) {
                _this2.state.inputValue = _this2.getInputDOMNode().value = '';
      }
      props.onBlur(_this2.getVLForOnChange(value));
      _this2.setOpenState(false);
    }, 10);
  };

  this.onClearSelection = function (event) {
    var props = _this2.props;
    var state = _this2.state;
    if (props.disabled) {
      return;
    }
    var inputValue = state.inputValue,
        value = state.value;

    event.stopPropagation();
    if (inputValue || value.length) {
      if (value.length) {
        _this2.fireChange([]);
      }
      _this2.setOpenState(false, true);
      if (inputValue) {
        _this2.setInputValue('');
      }
    }
  };

  this.onChoiceAnimationLeave = function () {
    _this2.refs.trigger.refs.trigger.forcePopupAlign();
  };

  this.getLabelBySingleValue = function (children, value) {
    if (value === undefined) {
      return null;
    }
    var label = null;
    React.Children.forEach(children, function (child) {
      if (!child) {
        return;
      }
      if (child.type.isSelectOptGroup) {
        var maybe = _this2.getLabelBySingleValue(child.props.children, value);
        if (maybe !== null) {
          label = maybe;
        }
      } else if (getValuePropValue(child) === value) {
        label = _this2.getLabelFromOption(child);
      }
    });
    return label;
  };

  this.getValueByLabel = function (children, label) {
    if (label === undefined) {
      return null;
    }
    var value = null;
    React.Children.forEach(children, function (child) {
      if (!child) {
        return;
      }
      if (child.type.isSelectOptGroup) {
        var maybe = _this2.getValueByLabel(child.props.children, label);
        if (maybe !== null) {
          value = maybe;
        }
      } else if (toArray(_this2.getLabelFromOption(child)).join('') === label) {
        value = getValuePropValue(child);
      }
    });
    return value;
  };

  this.getLabelFromOption = function (child) {
    return getPropValue(child, _this2.props.optionLabelProp);
  };

  this.getLabelFromProps = function (props, value) {
    return _this2.getLabelByValue(props.children, value);
  };

  this.getVLForOnChange = function (vls_) {
    var vls = vls_;
    if (vls !== undefined) {
      if (!_this2.props.labelInValue) {
        vls = vls.map(function (v) {
          return v.key;
        });
      } else {
        vls = vls.map(function (vl) {
          return { key: vl.key, label: vl.label };
        });
      }
      return isMultipleOrTags(_this2.props) ? vls : vls[0];
    }
    return vls;
  };

  this.getLabelByValue = function (children, value) {
    var label = _this2.getLabelBySingleValue(children, value);
    if (label === null) {
      return value;
    }
    return label;
  };

  this.getDropdownContainer = function () {
    if (!_this2.dropdownContainer) {
      _this2.dropdownContainer = document.createElement('div');
      document.body.appendChild(_this2.dropdownContainer);
    }
    return _this2.dropdownContainer;
  };

  this.getPlaceholderElement = function () {
    var props = _this2.props,
        state = _this2.state;

    var hidden = false;
    if (state.inputValue) {
      hidden = true;
    }
    if (state.value.length) {
      hidden = true;
    }
    if (isCombobox(props) && state.value.length === 1 && !state.value[0].key) {
      hidden = false;
    }
    var placeholder = props.placeholder;
    if (placeholder) {
      return React.createElement(
        'div',
        _extends({
          onMouseDown: preventDefaultEvent,
          style: _extends({
            display: hidden ? 'none' : 'block'
          }, UNSELECTABLE_STYLE)
        }, UNSELECTABLE_ATTRIBUTE, {
          onClick: _this2.onPlaceholderClick,
          className: props.prefixCls + '-selection__placeholder'
        }),
        placeholder
      );
    }
    return null;
  };

  this.getInputElement = function () {
    var props = _this2.props;
    var inputElement = props.getInputElement ? props.getInputElement() : React.createElement('input', { id: props.id, autoComplete: 'off' });
    var inputCls = classnames(inputElement.props.className, _defineProperty({}, props.prefixCls + '-search__field', true));
            return React.createElement(
      'div',
      { className: props.prefixCls + '-search__field__wrap' },
      React.cloneElement(inputElement, {
        ref: _this2.saveInputRef,
        onChange: _this2.onInputChange,
        onKeyDown: chaining(_this2.onInputKeyDown, inputElement.props.onKeyDown),
        value: _this2.state.inputValue,
        disabled: props.disabled,
        className: inputCls
      }),
      React.createElement(
        'span',
        {
          ref: _this2.saveInputMirrorRef,
          className: props.prefixCls + '-search__field__mirror'
        },
        _this2.state.inputValue,
        '\xA0'
      )
    );
  };

  this.getInputDOMNode = function () {
    return _this2.topCtrlNode ? _this2.topCtrlNode.querySelector('input,textarea,div[contentEditable]') : _this2.inputInstance;
  };

  this.getInputMirrorDOMNode = function () {
    return _this2.inputMirrorInstance;
  };

  this.getPopupDOMNode = function () {
    return _this2.refs.trigger.getPopupDOMNode();
  };

  this.getPopupMenuComponent = function () {
    return _this2.refs.trigger.getInnerMenu();
  };

  this.setOpenState = function (open, needFocus) {
    var props = _this2.props,
        state = _this2.state;

    if (state.open === open) {
      _this2.maybeFocus(open, needFocus);
      return;
    }
    var nextState = {
      open: open
    };
        if (!open && isSingleMode(props) && props.showSearch) {
      _this2.setInputValue('');
    }
    if (!open) {
      _this2.maybeFocus(open, needFocus);
    }
    _this2.setState(nextState, function () {
      if (open) {
        _this2.maybeFocus(open, needFocus);
      }
    });
  };

  this.setInputValue = function (inputValue) {
    var fireSearch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (inputValue !== _this2.state.inputValue) {
      _this2.setState({
        inputValue: inputValue
      });
      if (fireSearch) {
        _this2.props.onSearch(inputValue);
      }
    }
  };

  this.handleBackfill = function (item) {
    if (!_this2.props.backfill || !(isSingleMode(_this2.props) || isCombobox(_this2.props))) {
      return;
    }

    var key = getValuePropValue(item);
    var label = _this2.getLabelFromOption(item);
    var backfillValue = {
      key: key,
      label: label,
      backfill: true
    };

    if (isCombobox(_this2.props)) {
      _this2.setInputValue(key, false);
    }

    _this2.setState({
      value: [backfillValue]
    });
  };

  this.filterOption = function (input, child) {
    var defaultFilter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultFilterFn;
    var value = _this2.state.value;

    var lastValue = value[value.length - 1];
    if (!input || lastValue && lastValue.backfill) {
      return true;
    }
    var filterFn = _this2.props.filterOption;
    if ('filterOption' in _this2.props) {
      if (_this2.props.filterOption === true) {
        filterFn = defaultFilter;
      }
    } else {
      filterFn = defaultFilter;
    }

    if (!filterFn) {
      return true;
    } else if (child.props.disabled) {
      return false;
    } else if (typeof filterFn === 'function') {
      return filterFn.call(_this2, input, child);
    }
    return true;
  };

  this.timeoutFocus = function () {
    if (_this2.focusTimer) {
      _this2.clearFocusTime();
    }
    _this2.focusTimer = setTimeout(function () {
      _this2.props.onFocus();
    }, 10);
  };

  this.clearFocusTime = function () {
    if (_this2.focusTimer) {
      clearTimeout(_this2.focusTimer);
      _this2.focusTimer = null;
    }
  };

  this.clearBlurTime = function () {
    if (_this2.blurTimer) {
      clearTimeout(_this2.blurTimer);
      _this2.blurTimer = null;
    }
  };

  this.clearAdjustTimer = function () {
    if (_this2.skipAdjustOpenTimer) {
      clearTimeout(_this2.skipAdjustOpenTimer);
      _this2.skipAdjustOpenTimer = null;
    }
  };

  this.updateFocusClassName = function () {
    var refs = _this2.refs,
        props = _this2.props;
    
    if (_this2._focused) {
      classes(refs.root).add(props.prefixCls + '-focused');
    } else {
      classes(refs.root).remove(props.prefixCls + '-focused');
    }
  };

  this.maybeFocus = function (open, needFocus) {
    if (needFocus || open) {
      var input = _this2.getInputDOMNode();
      var _document = document,
          activeElement = _document.activeElement;

      if (input && (open || isMultipleOrTagsOrCombobox(_this2.props))) {
        if (activeElement !== input) {
          input.focus();
          _this2._focused = true;
        }
      } else {
        var selection = _this2.refs.selection;
        if (activeElement !== selection) {
          selection.focus();
          _this2._focused = true;
        }
      }
    }
  };

  this.addLabelToValue = function (props, value_) {
    var value = value_;
    if (props.labelInValue) {
      value.forEach(function (v) {
        v.label = v.label || _this2.getLabelFromProps(props, v.key);
      });
    } else {
      value = value.map(function (v) {
        return {
          key: v,
          label: _this2.getLabelFromProps(props, v)
        };
      });
    }
    return value;
  };

  this.addTitleToValue = function (props, values) {
    var nextValues = values;
    var keys = values.map(function (v) {
      return v.key;
    });
    React.Children.forEach(props.children, function (child) {
      if (!child) {
        return;
      }
      if (child.type.isSelectOptGroup) {
        nextValues = _this2.addTitleToValue(child.props, nextValues);
      } else {
        var value = getValuePropValue(child);
        var valueIndex = keys.indexOf(value);
        if (valueIndex > -1) {
          nextValues[valueIndex].title = child.props.title;
        }
      }
    });
    return nextValues;
  };

  this.removeSelected = function (selectedKey) {
    var props = _this2.props;
    if (props.disabled || _this2.isChildDisabled(selectedKey)) {
      return;
    }
    var label = void 0;
    var value = _this2.state.value.filter(function (singleValue) {
      if (singleValue.key === selectedKey) {
        label = singleValue.label;
      }
      return singleValue.key !== selectedKey;
    });
    var canMultiple = isMultipleOrTags(props);

    if (canMultiple) {
      var event = selectedKey;
      if (props.labelInValue) {
        event = {
          key: selectedKey,
          label: label
        };
      }
      props.onDeselect(event);
    }
    _this2.fireChange(value);
  };

  this.openIfHasChildren = function () {
    var props = _this2.props;
    if (React.Children.count(props.children) || isSingleMode(props)) {
      _this2.setOpenState(true);
    }
  };

  this.fireChange = function (value) {
    var props = _this2.props;
    if (!('value' in props)) {
      _this2.setState({
        value: value
      });
    }
    props.onChange(_this2.getVLForOnChange(value));
  };

  this.isChildDisabled = function (key) {
    return toArray(_this2.props.children).some(function (child) {
      var childValue = getValuePropValue(child);
      return childValue === key && child.props && child.props.disabled;
    });
  };

  this.tokenize = function (string) {
    var _props = _this2.props,
        multiple = _props.multiple,
        tokenSeparators = _props.tokenSeparators,
        children = _props.children;

    var nextValue = _this2.state.value;
    splitBySeparators(string, tokenSeparators).forEach(function (label) {
      var selectedValue = { key: label, label: label };
      if (findIndexInValueByLabel(nextValue, label) === -1) {
        if (multiple) {
          var value = _this2.getValueByLabel(children, label);
          if (value) {
            selectedValue.key = value;
            nextValue = nextValue.concat(selectedValue);
          }
        } else {
          nextValue = nextValue.concat(selectedValue);
        }
      }
    });
    return nextValue;
  };

  this.adjustOpenState = function () {
    if (_this2.skipAdjustOpen) {
      return;
    }
    var open = _this2.state.open;

    var options = [];
        if (open || _this2.hiddenForNoOptions) {
      options = _this2.renderFilterOptions();
    }
    _this2._options = options;

    if (isMultipleOrTagsOrCombobox(_this2.props) || !_this2.props.showSearch) {
      if (open && !options.length) {
        open = false;
        _this2.hiddenForNoOptions = true;
      }
            if (_this2.hiddenForNoOptions && options.length) {
        open = true;
        _this2.hiddenForNoOptions = false;
      }
    }
    _this2.state.open = open;
  };

  this.renderFilterOptions = function (inputValue) {
    return _this2.renderFilterOptionsFromChildren(_this2.props.children, true, inputValue);
  };

  this.renderFilterOptionsFromChildren = function (children, showNotFound, iv) {
    var sel = [];
    var props = _this2.props;
    var inputValue = iv === undefined ? _this2.state.inputValue : iv;
    var childrenKeys = [];
    var tags = props.tags;
    React.Children.forEach(children, function (child) {
      if (!child) {
        return;
      }
      if (child.type.isSelectOptGroup) {
        var innerItems = _this2.renderFilterOptionsFromChildren(child.props.children, false);
        if (innerItems.length) {
          var label = child.props.label;
          var key = child.key;
          if (!key && typeof label === 'string') {
            key = label;
          } else if (!label && key) {
            label = key;
          }
          sel.push(React.createElement(
            MenuItemGroup,
            { key: key, title: label },
            innerItems
          ));
        }
        return;
      }

      warning(child.type.isSelectOption, 'the children of `Select` should be `Select.Option` or `Select.OptGroup`, ' + ('instead of `' + (child.type.name || child.type.displayName || child.type) + '`.'));

      var childValue = getValuePropValue(child);
      if (_this2.filterOption(inputValue, child)) {
        sel.push(React.createElement(MenuItem, _extends({
          style: UNSELECTABLE_STYLE,
          attribute: UNSELECTABLE_ATTRIBUTE,
          value: childValue,
          key: childValue
        }, child.props)));
      }
      if (tags && !child.props.disabled) {
        childrenKeys.push(childValue);
      }
    });
    if (tags) {
            var value = _this2.state.value || [];
      value = value.filter(function (singleValue) {
        return childrenKeys.indexOf(singleValue.key) === -1 && (!inputValue || String(singleValue.key).indexOf(String(inputValue)) > -1);
      });
      sel = sel.concat(value.map(function (singleValue) {
        var key = singleValue.key;
        return React.createElement(
          MenuItem,
          {
            style: UNSELECTABLE_STYLE,
            attribute: UNSELECTABLE_ATTRIBUTE,
            value: key,
            key: key
          },
          key
        );
      }));
      if (inputValue) {
        var notFindInputItem = sel.every(function (option) {
                                                  var filterFn = function filterFn() {
            return getValuePropValue(option) === inputValue;
          };
          if (_this2.props.filterOption !== false) {
            return !_this2.filterOption.call(_this2, inputValue, option, filterFn);
          }
          return !filterFn();
        });
        if (notFindInputItem) {
          sel.unshift(React.createElement(
            MenuItem,
            {
              style: UNSELECTABLE_STYLE,
              attribute: UNSELECTABLE_ATTRIBUTE,
              value: inputValue,
              key: inputValue
            },
            inputValue
          ));
        }
      }
    }
    if (!sel.length && showNotFound && props.notFoundContent) {
      sel = [React.createElement(
        MenuItem,
        {
          style: UNSELECTABLE_STYLE,
          attribute: UNSELECTABLE_ATTRIBUTE,
          disabled: true,
          value: 'NOT_FOUND',
          key: 'NOT_FOUND'
        },
        props.notFoundContent
      )];
    }
    return sel;
  };

  this.renderTopControlNode = function () {
    var _state = _this2.state,
        value = _state.value,
        open = _state.open,
        inputValue = _state.inputValue;

    var props = _this2.props;
    var choiceTransitionName = props.choiceTransitionName,
        prefixCls = props.prefixCls,
        maxTagTextLength = props.maxTagTextLength,
        showSearch = props.showSearch;

    var className = prefixCls + '-selection__rendered';
        var innerNode = null;
    if (isSingleMode(props)) {
      var selectedValue = null;
      if (value.length) {
        var showSelectedValue = false;
        var opacity = 1;
        if (!showSearch) {
          showSelectedValue = true;
        } else {
          if (open) {
            showSelectedValue = !inputValue;
            if (showSelectedValue) {
              opacity = 0.4;
            }
          } else {
            showSelectedValue = true;
          }
        }
        var singleValue = value[0];
        selectedValue = React.createElement(
          'div',
          {
            key: 'value',
            className: prefixCls + '-selection-selected-value',
            title: singleValue.title || singleValue.label,
            style: {
              display: showSelectedValue ? 'block' : 'none',
              opacity: opacity
            }
          },
          value[0].label
        );
      }
      if (!showSearch) {
        innerNode = [selectedValue];
      } else {
        innerNode = [selectedValue, React.createElement(
          'div',
          {
            className: prefixCls + '-search ' + prefixCls + '-search--inline',
            key: 'input',
            style: {
              display: open ? 'block' : 'none'
            }
          },
          _this2.getInputElement()
        )];
      }
    } else {
      var selectedValueNodes = [];
      if (isMultipleOrTags(props)) {
        selectedValueNodes = value.map(function (singleValue) {
          var content = singleValue.label;
          var title = singleValue.title || content;
          if (maxTagTextLength && typeof content === 'string' && content.length > maxTagTextLength) {
            content = content.slice(0, maxTagTextLength) + '...';
          }
          var disabled = _this2.isChildDisabled(singleValue.key);
          var choiceClassName = disabled ? prefixCls + '-selection__choice ' + prefixCls + '-selection__choice__disabled' : prefixCls + '-selection__choice';
          return React.createElement(
            'li',
            _extends({
              style: UNSELECTABLE_STYLE
            }, UNSELECTABLE_ATTRIBUTE, {
              onMouseDown: preventDefaultEvent,
              className: choiceClassName,
              key: singleValue.key,
              title: title
            }),
            React.createElement(
              'div',
              { className: prefixCls + '-selection__choice__content' },
              content
            ),
            disabled ? null : React.createElement('span', {
              className: prefixCls + '-selection__choice__remove',
              onClick: _this2.removeSelected.bind(_this2, singleValue.key)
            })
          );
        });
      }
      selectedValueNodes.push(React.createElement(
        'li',
        {
          className: prefixCls + '-search ' + prefixCls + '-search--inline',
          key: '__input'
        },
        _this2.getInputElement()
      ));

      if (isMultipleOrTags(props) && choiceTransitionName) {
        innerNode = React.createElement(
          Animate,
          {
            onLeave: _this2.onChoiceAnimationLeave,
            component: 'ul',
            transitionName: choiceTransitionName
          },
          selectedValueNodes
        );
      } else {
        innerNode = React.createElement(
          'ul',
          null,
          selectedValueNodes
        );
      }
    }
    return React.createElement(
      'div',
      { className: className, ref: function ref(node) {
          return _this2.topCtrlNode = node;
        } },
      _this2.getPlaceholderElement(),
      innerNode
    );
  };
};

export default Select;


Select.displayName = 'Select';