// Dronacharya Guru Dakshina Two-Vault Psychological Commitment Tracker
// Manages Security Vault (₹500 initial deposit) and Withdrawable Vault (₹0 initial, unlocks +₹10 per completed quest)
'use client';

export interface VaultState {
  securityVault: number;
  withdrawableVault: number;
  unlockedQuests: string[];
  unlockedSeals: string[];
  lastRewardTimestamp?: number;
}

const VAULT_STORAGE_KEY = 'dronacharya_guru_vault_ledger_v1';

const DEFAULT_VAULT_STATE: VaultState = {
  securityVault: 500,
  withdrawableVault: 0,
  unlockedQuests: [],
  unlockedSeals: [],
};

export function getVaultState(): VaultState {
  if (typeof window === 'undefined') return DEFAULT_VAULT_STATE;
  try {
    const raw = localStorage.getItem(VAULT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        securityVault: typeof parsed.securityVault === 'number' ? parsed.securityVault : 500,
        withdrawableVault: typeof parsed.withdrawableVault === 'number' ? parsed.withdrawableVault : 0,
        unlockedQuests: Array.isArray(parsed.unlockedQuests) ? parsed.unlockedQuests : [],
        unlockedSeals: Array.isArray(parsed.unlockedSeals) ? parsed.unlockedSeals : [],
        lastRewardTimestamp: parsed.lastRewardTimestamp,
      };
    }
  } catch (e) {
    console.warn('Failed to parse vault ledger from localStorage:', e);
  }
  return DEFAULT_VAULT_STATE;
}

export function saveVaultState(state: VaultState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event('dronacharya_vault_changed'));
  } catch (e) {
    console.warn('Failed to save vault ledger:', e);
  }
}

/**
 * Transfer funds from Security Vault to Withdrawable Vault upon quest victory
 */
export function transferToWithdrawable(
  questId: string,
  rewardAmount: number = 10,
  sealName?: string
): { success: boolean; transferred: number; currentWithdrawable: number; isFirstUnlock: boolean } {
  const current = getVaultState();
  const isFirstUnlock = !current.unlockedQuests.includes(questId);

  // If already unlocked, allow safe re-run without duplicate money deduction
  if (!isFirstUnlock) {
    return {
      success: true,
      transferred: 0,
      currentWithdrawable: current.withdrawableVault,
      isFirstUnlock: false,
    };
  }

  const actualTransfer = Math.min(current.securityVault, rewardAmount);
  const newSecurity = Math.max(0, current.securityVault - actualTransfer);
  const newWithdrawable = current.withdrawableVault + actualTransfer;

  const newUnlockedQuests = [...current.unlockedQuests, questId];
  const newUnlockedSeals = sealName && !current.unlockedSeals.includes(sealName)
    ? [...current.unlockedSeals, sealName]
    : current.unlockedSeals;

  const updated: VaultState = {
    securityVault: newSecurity,
    withdrawableVault: newWithdrawable,
    unlockedQuests: newUnlockedQuests,
    unlockedSeals: newUnlockedSeals,
    lastRewardTimestamp: Date.now(),
  };

  saveVaultState(updated);

  return {
    success: true,
    transferred: actualTransfer,
    currentWithdrawable: newWithdrawable,
    isFirstUnlock: true,
  };
}

/**
 * Reset vault ledger for demo or re-play
 */
export function resetVaultLedger(): void {
  saveVaultState(DEFAULT_VAULT_STATE);
}
