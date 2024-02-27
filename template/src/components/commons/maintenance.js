
// outsource dependencies
import React, { memo } from 'react';

// local dependencies
import { FasIcon } from '../icons';

// local dependencies
export const Maintenance = memo(function MaintenancePage () {
  return <div id="MaintenancePage" className="d-flex align-items-center justify-content-around h-100">
    <div className="text-center" style={{ width: 640, maxWidth: '95%' }}>
      <h1 className="mb-3 position-relative">
        <FasIcon icon="cog" size="3x" spin className="text-info" />
        <span className="position-absolute" style={{ left: '33%', top: '10%' }}>
          <FasIcon icon="cog" size="lg" spin className="text-success fa-spin-reverse" />
        </span>
        <FasIcon icon="cog" size="5x" spin className="text-purple" />
        <FasIcon icon="cog" size="lg" spin className="text-warning ml-n2 fa-spin-reverse" />
      </h1>
      <h2> SITE IS UNDER MAINTENANCE </h2>
      <h5> We&#39;ll back online shortly! </h5>
    </div>
  </div>;
});
