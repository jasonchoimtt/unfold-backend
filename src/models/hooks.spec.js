/* eslint-disable no-unused-expressions */
import sinon from 'sinon';
import { Subscriber, Channels } from '../structs/stream';
import { withCreateEvent } from '../spec-utils';


describe('Model hooks', function() {
    let event, user;

    withCreateEvent(vars => { ({ event, user } = vars); });

    it('publishes a new post', async function() {
        let subs, deferred = new Promise(resolve => { subs = sinon.spy(resolve); });
        await Subscriber.subscribe(Channels.event(event.id), subs);

        // Note that the afterCreate hook runs asynchronously, so "await" is useless
        event.createPost({
            caption: 'Hate you',
            authorId: user.id,
        });

        await deferred;
        expect(subs).to.have.been.calledOnce;

        let e = JSON.parse(subs.firstCall.args[0]);
        expect(e).to.have.property('resource', 'post');
        expect(e).to.have.property('type', 'created');
        expect(e).to.have.deep.property('data.caption', 'Hate you');
        expect(e).to.have.deep.property('data.author.id', user.id);
    });
});
