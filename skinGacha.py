import numpy as np
import matplotlib.pyplot as plt

# Invite thresholds at which a new probability tier starts
thresholds = np.array([0, 3, 8, 16, 28, 43, 63, 87])

# Probability of obtaining the item on the pull at that threshold
probs = np.array([
    0.0005,  # 0.05%
    0.0025,  # 0.25%
    0.01,    # 1.00%
    0.015,   # 1.50%
    0.02,    # 2.00%
    0.05,    # 5.00%
    0.25,    # 25.00%
    1.00     # 100.00%
])

# Compute cumulative probability after each pull
survive = 1.0
cum_probs = []

for p in probs:
    survive *= (1 - p)
    cum_probs.append(1 - survive)

cum_probs = np.array(cum_probs)

# Plot
plt.figure(figsize=(10, 6))

plt.plot(
    thresholds,
    cum_probs * 100,
    marker="o",
    linewidth=2,
    label="Chance obtained by this point"
)

for x, y in zip(thresholds, cum_probs):
    plt.annotate(
        f"{y*100:.2f}%",
        (x, y*100),
        textcoords="offset points",
        xytext=(0, 8),
        ha="center"
    )

plt.xlabel("Invites Spent")
plt.ylabel("Cumulative Chance (%)")
plt.title("Gacha Outfit Probability vs Invites Spent")
plt.grid(True, alpha=0.3)
plt.ylim(0, 105)
plt.xlim(0, 90)
plt.legend()

plt.tight_layout()

print("\nStage Results")
print("-" * 40)

for invite, p in zip(thresholds, cum_probs):
    print(
        f"Invites: {invite:>2} | "
        f"Cumulative chance: {p*100:>6.2f}%"
    )

    # Expected invites spent

expected_invites = 0
survive = 1.0

for i in range(len(probs)):
    if i < len(thresholds) - 1:
        invites_paid = thresholds[i + 1]
    else:
        invites_paid = thresholds[i]

    expected_invites += survive * probs[i] * invites_paid
    survive *= (1 - probs[i])

print(f"\nExpected invites spent: {expected_invites:.2f}")

plt.show()