The instant is a moment in the chronology of a contingency event. Four instants currently exist in FARAO:
- the **preventive** instant occurs before any contingency, and describes the "base-case" situation.
- the **outage** instant occurs just after a contingency happens, in a time too short to allow the activation of any
  curative remedial action.
- the **auto** instant occurs after a contingency happens, and spans through the activation of automatic curative remedial
  actions ("automatons") that are triggered without any human intervention. These automatons are pre-configured to reduce
  some constraints, even though they can generate constraints elsewhere in the network.
- the **curative** instant occurs after a contingency happens, after enough time that would allow the human activation
  of curative remedial actions.

> 💡  **NOTE**  
> Flow / angle / voltage limits on critical network elements are usually different in these four instants.  
> The outage and auto instants are transitory, therefore less restrictive temporary limits (TATL) can be allowed in
> these instants.  
> On the contrary, the preventive and curative instants are supposed to be a lasting moment during which the grid
> operation is nominal (sometimes thanks to preventive and/or curative remedial actions), so they usually come with
> more restrictive permanent limits (PATL).  
> FARAO allows a different limit setting for different instants on critical network elements (see [CNECs](#cnecs)).
>
> ![patl-vs-tatl](/assets/img/patl-tatl.png)
> (**PRA** = Preventive Remedial Action,
> **ARA** = Automatic Remedial Action,
> **CRA** = Curative Remedial Action)

The FARAO object model includes the notion of "state". A state is either:

- the preventive state: the state of the base-case network, without any contingency, at the preventive instant.
- the combination of a given contingency with instant outage, auto or curative: the state of the network after the said
  contingency, at the given instant (= with more or less delay after this contingency).

The scheme below illustrates these notions of instant and state. It highlights the combinations of the situations which can be described in a CRAC, with a base-case situation, but also variants of this situation occurring at different moments in time after different probable and hypothetical contingencies.

![Instants & states](/assets/img/States_AUTO.png)

Instants and states are not directly added to a FARAO CRAC object model; they are implicitly created by business objects
that are described in the following paragraphs ([CNECs](#cnecs) and [remedial actions](#remedial-actions)).