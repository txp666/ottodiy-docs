import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Translate, {translate} from '@docusaurus/Translate';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          <Translate id="site.title" description="The title of the site">
            桌面AI人形机器人开源生态
          </Translate>
        </Heading>
        <p className="hero__subtitle">
          <Translate id="site.tagline" description="The tagline of the site">
            技术文档与分享
          </Translate>
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg margin-right--md"
            to="/docs/intro">
            <Translate id="homepage.startBuilding">开始制作机器人</Translate> ⏱️
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="https://qm.qq.com/q/DlTtZFM7VC">
            <Translate id="homepage.joinCommunity">加入开源技术交流社群</Translate> 💬
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="https://shanmaotech.cn"
            target="_blank"
            rel="noopener noreferrer">
            <Translate id="homepage.exploreProducts">探索更多产品</Translate> 🚀
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
      title={translate({
        id: 'homepage.title',
        message: '桌面AI人形机器人开源生态 - 开源otto机器人',
        description: 'The homepage title'
      })}
      description={translate({
        id: 'homepage.description',
        message: 'Otto DIY机器人是一个开源Arduino机器人项目，专为教育和STEM学习设计，提供完整的制作指南和编程教程',
        description: 'The homepage description'
      })}>
      <HomepageHeader />
      <main>
        <div className="container margin-top--lg">
          <div className="row">
            <div className="col col--6">
              <Heading as="h2">
                <Translate id="homepage.meetRobot">认识闪猫科技TenenglaAI桌面人形机器人</Translate>
              </Heading>
              <p>
                <Translate id="homepage.intro1">
                  闪猫科技研发团队结合3D打印与用通电子元件创造万物的理念，让小白用户也可以超低成本仅需30分钟即可手搓一专个属桌面AI机器人！
                  通过云端一体的架构给予了桌面机器人AI语音对话、AI动作反馈、AI视觉系统等能力，产品深融度合了感情陪伴、创客教育、3D打印、AI大模型、
                  具身智能、智能家等居多元场景，并支持一键入接闪猫科技AI、小智AI、涂鸦智能、火山引擎等主流AI服务，是一个AI桌面机器人的智能生态硬件平台。
                  通过本网站，您可以学习如何制作、编程和扩展 自己的桌面机器人。
                </Translate>
              </p>
              <p>
                <Translate
                  id="homepage.intro2"
                  values={{
                    xiaopeng: <a href="https://b23.tv/tr2PUDs" target="_blank" rel="noopener noreferrer">闪猫科技-小鹏</a>,
                    qiaodan: <a href="https://b23.tv/rli7Olc" target="_blank" rel="noopener noreferrer">闪猫科技-乔丹</a>
                  }}>
                  {'本网站目前仅分享由{xiaopeng}和{qiaodan}撰写的桌面AI机器人的制作文档'}
                </Translate>
              </p>
              <div className={styles.buttons}>
                <Link
                  className="button button--primary button--lg margin-right--md"
                  to="/docs/intro">
                  <Translate id="homepage.learnMore">了解更多</Translate>
                </Link>
                <Link
                  className="button button--secondary button--lg"
                  to="/docs/bom">
                  <Translate id="homepage.viewBOM">查看零部件清单</Translate>
                </Link>
                <Link
                  className="button button--warning button--lg"
                  to="https://item.taobao.com/item.htm?id=919684576480&pisk=gniSAycT__fWZQZddzv4C1AEBzErdK-wP9wKIvIPpuE899GxpgILwyHYkRyG2yFerXaITj4K4ukrGTmj1MSyZUDdAkrB_C-wbYDYxkdaIk0g8T2UQJBRT8EYMkyQmLH1uYDuxkBV9FuxE9NuSBW8pWpbDJwd2kULe-pbLJw8v7UdMZeTMkELyyUYk8289WULeKtYL8_d9WeRMZegeWELvXHvhJVYekEKZqB_dUNoFL4vjtNeczM8GMIK2H471TV0n-nXUzVie0sdvw27P5H8iQKKzDaxKyihKMaIeVc3BbCJ_zDKljw7An78XxgK1-mJb_wmzxh3MA6CjYE7dPELl9IKhu30k0r9XswmkYuKqb6Cv8mrbyNglpI38onaWVh5KdDY2Jh3SDRGq7HKIc0afn78XxgK12sPNGP6OAQC-7IQh5JXhwb3O90n2aT6Ida8n8a2hK1--ze0h5JXh_33y-27gK9fw2f..&skuId=5955601694653&spm=a21xtw.29178619.0.0">
                  <Translate id="homepage.buyKit">购买套件</Translate>
                </Link>
              </div>
            </div>
            <div className="col col--6">
              <img 
                src={require('@site/static/img/ottoRobot2.png').default}
                alt={translate({
                  id: 'homepage.robotAlt',
                  message: 'Otto机器人',
                  description: 'Alt text for robot image'
                })} 
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
