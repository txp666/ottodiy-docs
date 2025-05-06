import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            开始制作 Otto 机器人 ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - 开源otto机器人`}
      description="Otto DIY机器人是一个开源Arduino机器人项目，专为教育和STEM学习设计，提供完整的制作指南和编程教程">
      <HomepageHeader />
      <main>
        <div className="container margin-top--lg">
          <div className="row">
            <div className="col col--6">
              <Heading as="h2">认识Otto机器人</Heading>
              <p>
                Otto是一个完全开源的机器人，由Arduino驱动，能够行走、舞蹈、发声，
                是STEM教育的理想工具。通过本网站，你可以学习如何制作、编程和扩展
                自己的Otto机器人。
              </p>
              <p>
                本网站目前仅分享由<a href="https://b23.tv/7BLN9j1" target="_blank" rel="noopener noreferrer">B站飞起小鹏</a>修改的ESP32版+AI小智 的 Otto机器人 的制作文档，Arduino版本转到<a href="https://www.ottodiy.com/academy" target="_blank" rel="noopener noreferrer">官方网站</a>
              </p>
              <p>
                ESP32 AI版本基于小智已实现：Wi-Fi/4G连接、离线语音唤醒、流式对话、多语言识别、声纹识别、AI大模型集成、可配置角色和LCD表情显示等多种功能，让Otto变得更加智能！
              </p>
              <div className={styles.buttons}>
                <Link
                  className="button button--primary button--lg margin-right--md"
                  to="/docs/intro">
                  了解更多
                </Link>
                <Link
                  className="button button--secondary button--lg"
                  to="/docs/bom">
                  查看零部件清单
                </Link>
                <Link
                  className="button button--warning button--lg"
                  to="https://mall.bilibili.com/neul-next/detailuniversal/detail.html?isMerchant=1&page=detailuniversal_detail&saleType=0&itemsId=12340590&loadingShow=1&noTitleBar=1&msource=merchant_share">
                  购买套件
                </Link>
              </div>
            </div>
            <div className="col col--6">
              <img 
                src={require('@site/static/img/ottoRobot2.png').default}
                alt="Otto机器人" 
                className={styles.heroImg}
              />
            </div>
          </div>
        </div>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
