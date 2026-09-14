import React from 'react';
import { LudoTokenSlot } from './LudoTokenSlot.jsx';

/**
 * Legacy wrapper delegating to production LudoTokenSlot
 */
export const HomeTokenSlot = (props) => <LudoTokenSlot {...props} />;
export default HomeTokenSlot;
