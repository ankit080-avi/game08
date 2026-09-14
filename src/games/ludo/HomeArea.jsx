import React from 'react';
import { LudoHomeArea } from './LudoHomeArea.jsx';

/**
 * Legacy wrapper delegating to production LudoHomeArea
 */
export const HomeArea = (props) => <LudoHomeArea {...props} />;
export default HomeArea;
