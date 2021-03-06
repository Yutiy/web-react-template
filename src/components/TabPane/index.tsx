import React, { memo } from 'react';
import classnames from 'classnames';
import { useHistory, useLocation, useModel } from 'umi';
import { Tabs, Space } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd/es/tabs';
import useCloseTab from './hooks/useCloseTab';
import TabMenu from './TabMenu';
import TotalIcons from './TotalIcons';
import styles from './index.less';

export type TabPaneProps = {
  path: string;
};

const TabPane = () => {
  const history = useHistory();
  const { pathname, search } = useLocation();
  const { tabPanes, tabKey } = useModel('global');

  const path = pathname + search;
  const close = useCloseTab(tabPanes, path);

  const onPaneClose = (key: string) => {
    close(key);
  };
  const onTabClick: TabsProps['onTabClick'] = (key) => {
    if (tabKey === key) return;
    history.replace(key);
  };

  return (
    <div className={styles.headerTabPane}>
      <Tabs
        activeKey={tabKey}
        onTabClick={onTabClick}
        type="card"
        hideAdd
        tabBarStyle={{ margin: 0 }}
      >
        {tabPanes.map((pane) => {
          const tabName = pane.tabName || pane.name;
          const closeClassName = classnames(styles.closeIcon, {
            [styles.open]: tabKey === pane.displayPath,
          });
          const { displayPath } = pane;
          return pane.hideInTabs || !tabName ? null : (
            <Tabs.TabPane
              key={displayPath}
              tab={
                <TabMenu
                  path={path}
                  pathKey={displayPath}
                  tabPanes={tabPanes}
                  keeperKey={pane.keeperKey}
                >
                  <Space className={styles.pane}>
                    <div>
                      {/* {pane.icon && <TotalIcons name={pane.icon} />} */}
                      <span>{pane.tabName || pane.name}</span>
                    </div>
                    <CloseCircleOutlined
                      onClick={(e) => {
                        e.stopPropagation();
                        onPaneClose(displayPath);
                      }}
                      className={closeClassName}
                    />
                  </Space>
                </TabMenu>
              }
            ></Tabs.TabPane>
          );
        })}
      </Tabs>
    </div>
  );
};

export default memo(TabPane);
