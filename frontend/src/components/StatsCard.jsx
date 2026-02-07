import { motion } from 'framer-motion';
// import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({
  title,
  value,
  icon: Icon,
  color = 'indigo',
  subtitle,
  trend,
  delay = 0
}) => {
  const colorClasses = {
    indigo: {
      bg: 'from-indigo-500/10 to-indigo-600/10',
      border: 'border-indigo-500/20',
      icon: 'text-indigo-400',
      glow: 'shadow-indigo-500/20'
    },
    blue: {
      bg: 'from-blue-500/10 to-blue-600/10',
      border: 'border-blue-500/20',
      icon: 'text-blue-400',
      glow: 'shadow-blue-500/20'
    },
    green: {
      bg: 'from-green-500/10 to-green-600/10',
      border: 'border-green-500/20',
      icon: 'text-green-400',
      glow: 'shadow-green-500/20'
    },
    yellow: {
      bg: 'from-yellow-500/10 to-yellow-600/10',
      border: 'border-yellow-500/20',
      icon: 'text-yellow-400',
      glow: 'shadow-yellow-500/20'
    },
    red: {
      bg: 'from-red-500/10 to-red-600/10',
      border: 'border-red-500/20',
      icon: 'text-red-400',
      glow: 'shadow-red-500/20'
    },
    purple: {
      bg: 'from-purple-500/10 to-purple-600/10',
      border: 'border-purple-500/20',
      icon: 'text-purple-400',
      glow: 'shadow-purple-500/20'
    },
    pink: {
      bg: 'from-pink-500/10 to-pink-600/10',
      border: 'border-pink-500/20',
      icon: 'text-pink-400',
      glow: 'shadow-pink-500/20'
    },
    orange: {
      bg: 'from-orange-500/10 to-orange-600/10',
      border: 'border-orange-500/20',
      icon: 'text-orange-400',
      glow: 'shadow-orange-500/20'
    }
  };

  const colors = colorClasses[color] || colorClasses.indigo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 20px 40px -12px rgba(0, 0, 0, 0.5), 0 0 20px ${colors.glow.split('/')[0]}`
      }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colors.bg} backdrop-blur-xl border ${colors.border} p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full transform -translate-x-12 translate-y-12"></div>
      </div>

      <div className="relative flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.1 }}
            className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide"
          >
            {title}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
            className="text-3xl font-bold text-white mb-1"
          >
            {value}
          </motion.p>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.3 }}
              className="text-sm text-slate-400 mt-1"
            >
              {subtitle}
            </motion.p>
          )}

          {trend && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.4 }}
              className={`flex items-center mt-3 text-sm font-medium ${
                trend.positive ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {/* {trend.positive ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )} */}
              <span className="font-semibold">{trend.value}</span>
              <span className="text-slate-500 ml-1">vs last period</span>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: delay + 0.3,
            type: "spring",
            stiffness: 200,
            damping: 10
          }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
        >
          <Icon className={`w-7 h-7 ${colors.icon}`} />
        </motion.div>
      </div>

      {/* Hover Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${colors.icon.replace('text-', '').replace('-400', '')}10, transparent)`
        }}
      />
    </motion.div>
  );
};

export default StatsCard;
