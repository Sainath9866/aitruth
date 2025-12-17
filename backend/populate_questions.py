"""
Script to populate the database with advanced/challenging questions
"""
import requests

API_URL = "http://localhost:8001"

questions = [
    {
        "text": "Prove that the square root of 2 is irrational using proof by contradiction.",
        "subject": "Math",
        "reference_answer": "Assume √2 is rational, so √2 = a/b where a and b are coprime integers. Then 2 = a²/b², so a² = 2b². This means a² is even, so a must be even. Let a = 2k. Then 4k² = 2b², so b² = 2k², meaning b² is even and b is even. But if both a and b are even, they share a common factor of 2, contradicting our assumption that they are coprime. Therefore, √2 must be irrational.",
        "difficulty": "Hard"
    },
    {
        "text": "What is the Taylor series expansion of e^x around x = 0?",
        "subject": "Math",
        "reference_answer": "The Taylor series expansion of e^x around x = 0 is: e^x = 1 + x + x²/2! + x³/3! + x⁴/4! + ... = Σ(x^n/n!) for n from 0 to infinity. This series converges for all real values of x.",
        "difficulty": "Hard"
    },
    {
        "text": "Explain the Monty Hall problem and its solution.",
        "subject": "Math",
        "reference_answer": "The Monty Hall problem: You're on a game show with 3 doors. Behind one is a car, behind the others are goats. You pick door 1. The host, who knows what's behind each door, opens door 3 to reveal a goat. Should you switch to door 2? Answer: Yes, you should switch. Initially, you had a 1/3 chance of being correct. When the host reveals a goat, the probability doesn't transfer to your original choice - it transfers to the remaining door. By switching, you have a 2/3 chance of winning the car versus 1/3 if you stay.",
        "difficulty": "Hard"
    },
    {
        "text": "Explain the Heisenberg Uncertainty Principle and its mathematical formulation.",
        "subject": "Physics",
        "reference_answer": "The Heisenberg Uncertainty Principle states that you cannot simultaneously know the exact position and momentum of a particle with arbitrary precision. Mathematically: Δx · Δp ≥ ℏ/2, where Δx is the uncertainty in position, Δp is the uncertainty in momentum, and ℏ is the reduced Planck constant (h/2π ≈ 1.055 × 10⁻³⁴ J·s). This is a fundamental property of quantum mechanics, not a limitation of measurement technology.",
        "difficulty": "Hard"
    },
    {
        "text": "What is the Schrödinger equation and what does it describe?",
        "subject": "Physics",
        "reference_answer": "The time-dependent Schrödinger equation is: iℏ(∂ψ/∂t) = Ĥψ, where ψ is the wave function, i is the imaginary unit, ℏ is the reduced Planck constant, t is time, and Ĥ is the Hamiltonian operator. It describes how the quantum state of a physical system changes over time and is fundamental to quantum mechanics. The wave function ψ contains all possible information about the system.",
        "difficulty": "Hard"
    },
    {
        "text": "Derive the time dilation formula in special relativity.",
        "subject": "Physics",
        "reference_answer": "From the Lorentz transformation and the principle that the speed of light is constant in all frames: Consider a light clock moving at velocity v. In the rest frame, light travels distance 2L in time t₀ = 2L/c. In a moving frame, light travels a longer path forming a triangle. Using Pythagorean theorem: (ct/2)² = L² + (vt/2)². Solving for t in terms of t₀: t = t₀/√(1 - v²/c²) = γt₀, where γ is the Lorentz factor. This shows moving clocks run slower.",
        "difficulty": "Hard"
    },
    {
        "text": "Explain the mechanism of CRISPR-Cas9 gene editing.",
        "subject": "Biology",
        "reference_answer": "CRISPR-Cas9 is a gene editing tool derived from bacterial immune systems. It uses two components: (1) Cas9 enzyme acts as molecular scissors to cut DNA, and (2) guide RNA (gRNA) directs Cas9 to the specific DNA sequence to cut. The gRNA is designed to match the target gene sequence. When Cas9 cuts the DNA, the cell's repair mechanisms activate. Scientists can exploit this by providing a DNA template, causing the cell to insert desired sequences during repair. This allows precise editing of genes to correct mutations or add new traits.",
        "difficulty": "Hard"
    },
    {
        "text": "What is the Krebs cycle and where does it occur?",
        "subject": "Biology",
        "reference_answer": "The Krebs cycle (citric acid cycle) is a series of chemical reactions in cellular respiration that generates energy through oxidation of acetyl-CoA. It occurs in the mitochondrial matrix. The cycle produces: 3 NADH, 1 FADH₂, 1 ATP (or GTP), and 2 CO₂ per acetyl-CoA. Key steps: acetyl-CoA + oxaloacetate → citrate → isocitrate → α-ketoglutarate → succinyl-CoA → succinate → fumarate → malate → oxaloacetate. The NADH and FADH₂ feed into the electron transport chain for ATP synthesis.",
        "difficulty": "Hard"
    },
    {
        "text": "Explain the time complexity of QuickSort and when it performs worst.",
        "subject": "Computer Science",
        "reference_answer": "QuickSort has an average time complexity of O(n log n) and space complexity of O(log n) due to recursion. However, worst-case time complexity is O(n²), which occurs when the pivot selection consistently results in the most unbalanced partitions (e.g., always picking the smallest or largest element as pivot). This happens with already sorted or reverse-sorted arrays when using the first or last element as pivot. Randomized pivot selection reduces this risk. Best case is O(n log n) with balanced partitions.",
        "difficulty": "Hard"
    },
    {
        "text": "What is the difference between TCP and UDP protocols?",
        "subject": "Computer Science",
        "reference_answer": "TCP (Transmission Control Protocol) is connection-oriented, reliable, and guarantees ordered delivery with error checking, acknowledgments, and retransmission. It uses a three-way handshake and has higher overhead. UDP (User Datagram Protocol) is connectionless, unreliable (no guarantee of delivery), has no ordering, minimal error checking, and lower overhead. TCP is used for applications requiring reliability (HTTP, email, file transfer). UDP is used for real-time applications where speed matters more than reliability (video streaming, gaming, VoIP).",
        "difficulty": "Medium"
    },
    {
        "text": "Explain Le Chatelier's Principle with an example.",
        "subject": "Chemistry",
        "reference_answer": "Le Chatelier's Principle states that if a dynamic equilibrium is disturbed by changing conditions (temperature, pressure, concentration), the system shifts to counteract the change and restore equilibrium. Example: N₂(g) + 3H₂(g) ⇌ 2NH₃(g) + heat. If temperature increases, the system shifts left (endothermic direction) to absorb heat. If pressure increases, it shifts right (fewer moles of gas). If NH₃ is removed, it shifts right to produce more NH₃. This principle is crucial in industrial processes like the Haber process.",
        "difficulty": "Hard"
    },
    {
        "text": "What is entropy and how does it relate to the Second Law of Thermodynamics?",
        "subject": "Chemistry",
        "reference_answer": "Entropy (S) is a measure of disorder or randomness in a system. The Second Law of Thermodynamics states that in any spontaneous process, the total entropy of the universe (system + surroundings) always increases: ΔS_universe > 0. For a spontaneous process at constant temperature and pressure, the Gibbs free energy change must be negative: ΔG = ΔH - TΔS < 0. Entropy increases when: ice melts, gases expand, or substances dissolve. This law explains why certain processes are irreversible and energy naturally disperses.",
        "difficulty": "Hard"
    }
]

def populate_questions():
    print("🚀 Populating database with advanced questions...\n")
    
    success_count = 0
    for i, q in enumerate(questions, 1):
        try:
            response = requests.post(f"{API_URL}/questions/", json=q)
            if response.status_code == 200:
                print(f"✅ Added Q{i}: {q['subject']} - {q['text'][:50]}...")
                success_count += 1
            else:
                print(f"❌ Failed Q{i}: {response.status_code}")
        except Exception as e:
            print(f"❌ Error adding Q{i}: {e}")
    
    print(f"\n✅ Successfully added {success_count}/{len(questions)} questions!")

if __name__ == "__main__":
    populate_questions()
