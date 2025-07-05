
import React from 'react';
import WorkflowTester from '@/components/WorkflowTester';

const WorkflowTest = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🛸 اختبار مساعد نجموز
          </h1>
          <p className="text-xl text-gray-300">
            تجربة كاملة لنظام العمل والتحقق من كل المراحل
          </p>
        </div>
        <WorkflowTester />
      </div>
    </div>
  );
};

export default WorkflowTest;
