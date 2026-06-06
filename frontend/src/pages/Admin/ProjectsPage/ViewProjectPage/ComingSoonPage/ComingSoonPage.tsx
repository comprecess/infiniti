import { useLocation } from 'react-router-dom';
import styles from './ComingSoonPage.module.scss';

const featureInfo: Record<string, { title: string; description: string }> = {
  'pipeline-buyers': {
    title: 'Buyer Pipeline',
    description: 'Manage potential buyers, track outreach progress, and organize acquisition interest. This feature will allow you to create buyer profiles, track communication history, and manage the deal negotiation process.',
  },
  'pipeline-investors': {
    title: 'Investor Pipeline',
    description: 'Manage investor relationships, track funding rounds, and organize investment interest. This feature will allow you to create investor profiles, share deal room access, and track due diligence progress.',
  },
};

const ComingSoonPage = () => {
  const location = useLocation();
  const pathSegment = location.pathname.split('/').pop() || '';
  const info = featureInfo[pathSegment] || {
    title: 'Feature',
    description: 'This feature is currently under development.',
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <img src="/icons/elements.svg" alt="" className={styles.icon} />
        <h1 className={styles.title}>{info.title}</h1>
        <div className={styles.badgeWrapper}>
          <span className={styles.badge}>Coming Soon</span>
        </div>
        <p className={styles.description}>{info.description}</p>
        <p className={styles.hint}>
          This feature is planned for a future release. You will be notified when it becomes available.
        </p>
      </div>
    </div>
  );
};

export { ComingSoonPage as AdminProjectsComingSoonPage };
