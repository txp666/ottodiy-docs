import clsx from 'clsx';
import Heading from '@theme/Heading';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: <Translate id="features.easyToLearn.title">简单易学</Translate>,
    imgSrc: require('@site/static/img/ottoRobot3.png').default,
    description: (
      <Translate id="features.easyToLearn.description">
        AI桌面机器人设计简洁，使用常见的组件，非常适合初学者入门。
        即使没有电子或编程基础，也能快速完成制作。
      </Translate>
    ),
  },
  {
    title: <Translate id="features.openSource.title">开源灵活</Translate>,
    imgSrc: require('@site/static/img/ottoRobot2.png').default,
    description: (
      <Translate id="features.openSource.description">
        作为完全开源项目，该机器人支持自由修改和扩展。你可以添加传感器、
        更改外观或开发新功能，打造专属机器人。
      </Translate>
    ),
  },
  {
    title: <Translate id="features.stemEducation.title">STEM教育工具</Translate>,
    imgSrc: require('@site/static/img/ottoRobot4.png').default,
    description: (
      <Translate id="features.stemEducation.description">
        该机器人融合了机械、电子、编程和3D打印等多学科知识，
        是激发学生创造力和培养解决问题能力的理想教具。
      </Translate>
    ),
  },
];

function Feature({imgSrc, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={imgSrc} className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <Heading as="h2" className={styles.featuresTitle}>
          <Translate id="features.mainTitle">AI桌面机器人的特点</Translate>
        </Heading>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
