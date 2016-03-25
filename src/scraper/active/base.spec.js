/**
 * Unit testing for the dispatcher.
 */
import url from 'url';
import sinon from 'sinon';
import { Route, Dispatcher } from './base';


describe('Scraper dispatcher', function() {
    it('has a behaving route matcher', function() {
        let route = new Route('//www.google.com/search/:keyword');

        let matches = x => expect(route.match(url.parse(x)));

        matches('http://www.google.com/search/cats')
            .to.deep.equal({ keyword: 'cats' });
        matches('https://www.google.com/search/cats')
            .to.deep.equal({ keyword: 'cats' });
        matches('//www.google.com/search/cats').not.to.be.ok; // eslint-disable-line

        route = new Route('http://fb.me/');

        matches('http://fb.me').to.be.ok; // eslint-disable-line
        matches('http://fb.me/').to.be.ok; // eslint-disable-line
        matches('https://fb.me').not.to.be.ok; // eslint-disable-line
        matches('http://fb.me:80').not.to.be.ok; // eslint-disable-line

        route = new Route('//:blog.blogspot.:tld/:year/:post');

        matches('https://unfold.blogspot.hk/2016/welcome')
            .to.deep.equal({ blog: 'unfold', tld: 'hk', year: '2016', post: 'welcome' });
        matches('https://unfold.blogspot.hk/2016/welcome?to=unfold')
            .to.deep.equal({ blog: 'unfold', tld: 'hk', year: '2016', post: 'welcome' });
        matches('http://duarte.blogspot.com/sth/funny/really').not.to.be.ok; // eslint-disable-line

        route = new Route('http://localhost/:path+');
        matches('http://localhost/hello/world')
            .to.deep.equal({ path: 'hello/world' });
        matches('http://localhost/').not.to.be.ok; // eslint-disable-line

        route = new Route('http://127.0.0.1/:path*');
        matches('http://127.0.0.1:80/').not.to.be.ok; // eslint-disable-line
        matches('http://127.0.0.1/').to.deep.equal({});
        matches('http://127.0.0.1/haha/yaya')
            .to.deep.equal({ path: 'haha/yaya' });

        // Catch all
        route = new Route('//:domain+/:path*');
        matches('http://hello-world.online/').to.be.ok; // eslint-disable-line
    });

    let noop = async () => {};

    it('throws on no route', async function() {
        let dispatcher = new Dispatcher();
        await expect(dispatcher.dispatch('http://example.com/non-sense'))
            .to.be.rejected; // eslint-disable-line
    });

    it('throws on missing route', async function() {
        let dispatcher = new Dispatcher();
        dispatcher.use('//non-sense.org/', noop);
        await expect(dispatcher.dispatch('http://example.com/non-sense'))
            .to.be.rejected; // eslint-disable-line
    });

    it('resolves when dispatching is done', async function() {
        let dispatcher = new Dispatcher();
        dispatcher.use('//localhost/index.html', noop);
        await dispatcher.dispatch('http://localhost/index.html');
    });

    it('supports a synchronous handler', async function() {
        let dispatcher = new Dispatcher();
        let spy = sinon.spy(() => 'result!');
        dispatcher.use('//localhost/', spy);

        expect(await dispatcher.dispatch('http://localhost/')).to.equal('result!');
        expect(spy).to.have.been.calledOnce; // eslint-disable-line
    });

    it('provides the URL params', async function() {
        let dispatcher = new Dispatcher();
        let spy = sinon.spy();
        dispatcher.use('http://:blog.blogspot.hk/:post', spy);

        await dispatcher.dispatch('http://jason.blogspot.hk/awesome-stuff?sth=fun');
        expect(spy).to.have.been.calledOnce; // eslint-disable-line
        expect(spy.args[0][0]).to.have.property('params').deep.equal({
            blog: 'jason',
            post: 'awesome-stuff',
        });
        expect(spy.args[0][0]).to.have.property('query', 'sth=fun');
    });

    it('resolves the routes in order', async function() {
        let dispatcher = new Dispatcher();
        let spy1 = sinon.spy(), spy2 = sinon.spy();
        dispatcher.use('//localhost/', spy1);
        dispatcher.use('https://localhost/', spy2);

        await dispatcher.dispatch('https://localhost/');
        expect(spy1).to.have.been.calledOnce; // eslint-disable-line
        expect(spy2).not.to.have.been.called; // eslint-disable-line

        dispatcher = new Dispatcher();
        spy1 = sinon.spy(); spy2 = sinon.spy();
        dispatcher.use('https://localhost/', spy2);
        dispatcher.use('//localhost/', spy1);

        await dispatcher.dispatch('https://localhost/');
        expect(spy1).not.to.have.been.called; // eslint-disable-line
        expect(spy2).to.have.been.calledOnce; // eslint-disable-line
    });

    it('composes multiple dispatchers', async function() {
        let dispatcher = new Dispatcher();
        let spy1 = sinon.spy();
        dispatcher.use('//localhost/', spy1);

        let dispatcher2 = new Dispatcher();
        let spy2 = sinon.spy();
        dispatcher2.use('//fb.me/', spy2);
        dispatcher.use(dispatcher2);

        await dispatcher.dispatch('http://fb.me/');
        expect(spy1).not.to.have.been.called; // eslint-disable-line
        expect(spy2).to.have.been.called; // eslint-disable-line
    });
});
