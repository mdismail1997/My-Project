import React from 'react';
import { ScrollView } from 'native-base';

interface SkeletonScrollViewProps {
  count?: number;
}

export const SkeletonScrollView: React.FC<SkeletonScrollViewProps> = ({
  count = 1,
  children,
}) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {new Array(count)
        .fill('')
        .map((_el, _index) =>
          React.Children.map(children, (child) =>
            React.cloneElement(
              child as
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | React.ReactPortal,
              { key: _index }
            )
          )
        )}
    </ScrollView>
  );
};
