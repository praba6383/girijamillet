# Security Specification: Girija Millets Firestore Database

## 1. Data Invariants
1. **Public Readability**: The product catalog is a public product listing. Anyone (including unauthenticated guests) must be able to read and list products so they can browse the store.
2. **Schema Integrity**: Any write (create, update, delete) to the `products` collection must strictly adhere to the `Product` schema. No "ghost keys" or invalid field types are allowed.
3. **Data Bound Constraints**: String sizes and array lengths must be limited to prevent Denials of Wallet (resource exhaustion / excessively large payloads).

## 2. The "Dirty Dozen" Payloads
The following payloads attempt to break the laws of Identity, Integrity, and State, and must be rejected by Firestore Security Rules:

1. **Malicious ID Poisoning**: Write a product with a 10KB junk-character document ID.
2. **Ghost-Key Insertion**: Add an unallowed key (e.g., `isVerifiedAdmin: true`) to the product object.
3. **Negative Price**: Settle product price to negative values (e.g., `price: -100`).
4. **Invalid Type for Name**: Submit `name` as a boolean (`name: true`).
5. **Excessive Description Size**: Submit a description string over 10,000 characters.
6. **Malicious Ingredients List**: Submit ingredients as a boolean instead of an array.
7. **Malicious Benefits List**: Submit benefits as a naked string instead of an array of strings.
8. **Invalid Price Type**: Set price to a string (e.g., `price: "free"`).
9. **Spooted FSSAI Format**: Set `fssai` to highly nested object instead of string.
10. **Theme Poisoning**: Set `colorTheme` to empty or extremely long script injections.
11. **Excessive Image Payload**: Uploading an image larger than 2,000,000 characters.
12. **Missing Required Fields**: Create a product without a `price` or `name` field.

## 3. Test Runner Concept
Each of these payloads must raise `PERMISSION_DENIED` during client-side or rule-side evaluation.
