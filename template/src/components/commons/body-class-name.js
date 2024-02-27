// outsource dependencies
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Children, cloneElement, isValidElement, memo, useEffect } from 'react';


const addBodyClass = (className) => document.body.classList.add(className);
const removeBodyClass = (className) => document.body.classList.remove(className);

export const BodyClassName = memo(function BodyClassName ({ className, children }) {
  useEffect(() => {
    // NOTE Set up
    !_.isEmpty(className) && className?.split(' ').map((classItemName) => addBodyClass(classItemName));
    // NOTE Clean up
    return () => {
      !_.isEmpty(className) && className?.split(' ').map((classItemName) => removeBodyClass(classItemName));
    };
  }, [className]);

  return (<>
    { Children.map(children, (child) => {
      if (!isValidElement(child)) {
        return child;
      }
      return cloneElement(child, {});
    })}
  </>);
});

BodyClassName.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired,
  className: PropTypes.string.isRequired,
};
