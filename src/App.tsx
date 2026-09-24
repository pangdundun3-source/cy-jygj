/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FamilyProvider } from './context/FamilyContext';
import { SimulatorControls } from './components/phone/SimulatorControls';
import { PhoneFrame } from './components/phone/PhoneFrame';

export default function App() {
  return (
    <FamilyProvider>
      <div className="min-h-screen bg-[#F0F2F6] text-slate-800 flex flex-col items-center justify-start overflow-x-hidden selection:bg-emerald-500 selection:text-white">
        {/* Top Control Bar for Simulator & Presenter */}
        <SimulatorControls />

        {/* Mobile Phone Mockup / Viewport */}
        <div className="w-full flex-1 flex justify-center items-start">
          <PhoneFrame />
        </div>
      </div>
    </FamilyProvider>
  );
}

