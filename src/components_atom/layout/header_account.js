import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { notification, Menu, Dropdown, Icon, Badge } from 'antd';
import styles from './header_account.less';
import CONSTANTS from '../../constants';
import Filters from '../../filters';
import User from '../../utils/user';
// import {
//   LogoutError,
// } from '../../utils/error_class';
// import { undershoot as sentryUndershoot } from '../../utils/dva-sentry';

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    debugAdd('header_account', this);
  }

  componentDidMount = () => {
    this.getUnreadMessage();
  }

  componentWillReceiveProps = () => {
  }

  componentWillUnmount = () => {}

  getUnreadMessage = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sys_message/unreadCount',
      payload: {},
    });
  }

  handleVisibleChange = (flag) => {
    this.setState({ visible: flag });
  }

  handleMenuClick = (e) => {
    // const { history } = this.props;
    this.setState({ visible: false });
    if ('logout' === e.key) {
      // sentryUndershoot.capture(new LogoutError(msg), {
      //   msg,
      // });
      // document.cookie = 'isLogout=true;path=/';
      User.clean();
      notification.success({
        message: '系统提示',
        description: '你已经成功退出登录',
        duration: CONSTANTS.NOTIFICATION_DURATION,
      });
      window.location.href = '/app_login';
    }
  }

  render() {
    const { userInfo, unreadCount } = this.props;
    if (!userInfo) {
      return (<div>请先登录</div>);
    }

    const menu = (
      <Menu selectedKeys={[]} defaultSelectedKeys={[]} onClick={this.handleMenuClick} className={styles.accountDownMenu}>
        <Menu.Item key="account_1">
          <div>
            <Link to="/app/sys_message">
              <Icon type="message" />
              <span>我的消息</span>
              <Badge count={unreadCount} />
            </Link>
          </div>
        </Menu.Item>
        <Menu.Item key="account_2">
          <div>
            <Link to="/app/password/edit">
              <Icon type="edit" />
              <span>修改密码</span>
            </Link>
          </div>
        </Menu.Item>
        <Menu.Item key="detect">
          <div>
            <Link to="/app/detect">
              <Icon type="dashboard" />
              <span>系统检测</span>
            </Link>
          </div>
        </Menu.Item>
        <Menu.Item key="logout">
          <div>
            <Link>
              <Icon type="logout" />
              <span>退出登录</span>
            </Link>
          </div>
        </Menu.Item>
      </Menu>
    );

    /*
    */
    return (
      <div className={styles.normal}>
        <Dropdown
          overlay={menu}
          trigger={['click']}
          onVisibleChange={this.handleVisibleChange}
          visible={this.state.visible}
        >
          <div className="text-white">
            <img className={`img-1-1-40 ${styles.accountImg}`} src={Filters.qiniuImage(userInfo.avatar, { width: 80, height: 80 })} alt={userInfo.name} />
            <span className={styles.accountName}>
              <span className={768 > window.innerWidth ? 'ant-hide' : ''}>{userInfo.name}</span>
              <span className="header-account-role">
                &nbsp;&nbsp;
                { userInfo.role_name }
              </span>
            </span>
            { this.state.visible ? null : <Badge count={unreadCount} /> }
            <span className={styles.headerDownIcon}><Icon type="down" /></span>
          </div>
        </Dropdown>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userInfo: state.user.info,
    unreadCount: state.sys_message.unreadCount,
  };
}

export default connect(mapStateToProps)(Component);